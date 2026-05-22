import crypto from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import tls from "node:tls";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export function loadDotenv(filePath = path.join(ROOT, ".env")) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function envBool(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "y", "on"].includes(value.trim().toLowerCase());
}

export function getConfig() {
  loadDotenv();
  const missing = ["ALI_MAIL_ADDRESS", "ALI_MAIL_PASSWORD"].filter(
    (name) => !process.env[name],
  );
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(
        ", ",
      )}. Copy .env.example to .env and fill them locally.`,
    );
  }

  return {
    address: process.env.ALI_MAIL_ADDRESS,
    password: process.env.ALI_MAIL_PASSWORD,
    imapHost: process.env.ALI_MAIL_IMAP_HOST || "imap.sg.aliyun.com",
    imapPort: Number(process.env.ALI_MAIL_IMAP_PORT || 993),
    smtpHost: process.env.ALI_MAIL_SMTP_HOST || "smtp.sg.aliyun.com",
    smtpPort: Number(process.env.ALI_MAIL_SMTP_PORT || 465),
    defaultMailbox: process.env.ALI_MAIL_DEFAULT_MAILBOX || "INBOX",
    dryRun: envBool("ALI_MAIL_DRY_RUN", true),
  };
}

class SocketReader {
  constructor(socket) {
    this.socket = socket;
    this.buffer = Buffer.alloc(0);
    this.waiters = [];
    socket.on("data", (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.flush();
    });
    socket.on("error", (error) => {
      for (const waiter of this.waiters.splice(0)) waiter.reject(error);
    });
    socket.on("end", () => {
      for (const waiter of this.waiters.splice(0)) {
        waiter.reject(new Error("Socket ended before response completed"));
      }
    });
  }

  flush() {
    for (const waiter of [...this.waiters]) {
      if (waiter.tryResolve()) {
        this.waiters.splice(this.waiters.indexOf(waiter), 1);
      }
    }
  }

  readUntil(predicate) {
    return new Promise((resolve, reject) => {
      const waiter = {
        reject,
        tryResolve: () => {
          const result = predicate(this.buffer);
          if (result === null) return false;
          this.buffer = this.buffer.slice(result.bytesRead);
          resolve(result.value);
          return true;
        },
      };
      if (!waiter.tryResolve()) this.waiters.push(waiter);
    });
  }

  readLine() {
    return this.readUntil((buffer) => {
      const index = buffer.indexOf("\r\n");
      if (index === -1) return null;
      return {
        value: buffer.slice(0, index).toString("utf8"),
        bytesRead: index + 2,
      };
    });
  }

  readBytes(length) {
    return this.readUntil((buffer) => {
      if (buffer.length < length) return null;
      return {
        value: buffer.slice(0, length),
        bytesRead: length,
      };
    });
  }
}

class ImapClient {
  constructor(config) {
    this.config = config;
    this.tag = 0;
    this.socket = null;
    this.reader = null;
  }

  async connect() {
    this.socket = tls.connect({
      host: this.config.imapHost,
      port: this.config.imapPort,
      servername: this.config.imapHost,
    });
    await onceConnect(this.socket);
    this.reader = new SocketReader(this.socket);
    const greeting = await this.reader.readLine();
    if (!greeting.startsWith("* OK")) {
      throw new Error(`Unexpected IMAP greeting: ${greeting}`);
    }
    await this.command(`LOGIN ${quoteImap(this.config.address)} ${quoteImap(this.config.password)}`);
    return this;
  }

  async command(command) {
    const tag = `A${String(++this.tag).padStart(4, "0")}`;
    this.socket.write(`${tag} ${command}\r\n`);
    const items = [];
    while (true) {
      const line = await this.reader.readLine();
      items.push({ type: "line", value: line });
      const literalMatch = line.match(/\{(\d+)\}$/);
      if (literalMatch) {
        const literal = await this.reader.readBytes(Number(literalMatch[1]));
        items.push({ type: "literal", value: literal });
      }
      if (line.startsWith(`${tag} `)) {
        if (!line.startsWith(`${tag} OK`)) {
          throw new Error(`IMAP command failed: ${line}`);
        }
        return items;
      }
    }
  }

  async listFolders() {
    const items = await this.command('LIST "" "*"');
    return items
      .filter((item) => item.type === "line" && item.value.startsWith("* LIST"))
      .map((item) => item.value);
  }

  async select(mailbox) {
    await this.command(`SELECT ${quoteImap(mailbox)}`);
  }

  async search(criteria) {
    const items = await this.command(`SEARCH ${criteria.join(" ")}`);
    const searchLine = items.find(
      (item) => item.type === "line" && item.value.startsWith("* SEARCH"),
    );
    if (!searchLine) return [];
    return searchLine.value
      .replace("* SEARCH", "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  async fetchMessages(ids) {
    if (!ids.length) return [];
    const items = await this.command(`FETCH ${ids.join(",")} (BODY.PEEK[])`);
    const messages = [];
    let currentId = null;
    for (const item of items) {
      if (item.type === "line") {
        const match = item.value.match(/^\* (\d+) FETCH/);
        if (match) currentId = match[1];
      }
      if (item.type === "literal") {
        messages.push({ id: currentId, ...summarizeEmail(item.value.toString("utf8")) });
      }
    }
    return messages;
  }

  close() {
    if (!this.socket) return;
    this.socket.end();
  }
}

function onceConnect(socket) {
  return new Promise((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("connect", resolve);
    socket.once("error", reject);
  });
}

function quoteImap(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildSearchCriteria(args) {
  const criteria = ["ALL"];
  if (args.from) criteria.push("FROM", quoteImap(args.from));
  if (args.subject) criteria.push("SUBJECT", quoteImap(args.subject));
  if (args.text) criteria.push("TEXT", quoteImap(args.text));
  return criteria;
}

function parseHeaders(raw) {
  const [rawHeaders, ...bodyParts] = raw.split(/\r?\n\r?\n/);
  const unfolded = rawHeaders.replace(/\r?\n[ \t]+/g, " ");
  const headers = {};
  for (const line of unfolded.split(/\r?\n/)) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    headers[line.slice(0, index).toLowerCase()] = line.slice(index + 1).trim();
  }
  return { headers, body: bodyParts.join("\n\n") };
}

function decodeMimeWords(value = "") {
  return value.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g, (_, charset, encoding, text) => {
    let buffer;
    if (encoding.toUpperCase() === "B") {
      buffer = Buffer.from(text, "base64");
    } else {
      buffer = Buffer.from(
        text.replace(/_/g, " ").replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
          String.fromCharCode(Number.parseInt(hex, 16)),
        ),
        "binary",
      );
    }
    return buffer.toString(normalizeCharset(charset));
  });
}

function normalizeCharset(charset) {
  const normalized = String(charset).toLowerCase();
  if (normalized.includes("gb")) return "utf8";
  return "utf8";
}

function decodeTransfer(body, encoding = "") {
  const normalized = encoding.toLowerCase();
  if (normalized === "base64") return Buffer.from(body.replace(/\s/g, ""), "base64").toString("utf8");
  if (normalized === "quoted-printable") {
    return body
      .replace(/=\r?\n/g, "")
      .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
        String.fromCharCode(Number.parseInt(hex, 16)),
      );
  }
  return body;
}

function extractText(headers, body) {
  const contentType = headers["content-type"] || "";
  if (!contentType.toLowerCase().includes("multipart/")) {
    return decodeTransfer(body, headers["content-transfer-encoding"]).trim();
  }

  const boundaryMatch = contentType.match(/boundary="?([^";]+)"?/i);
  if (!boundaryMatch) return "";
  const boundary = boundaryMatch[1];
  const parts = body.split(`--${boundary}`);
  for (const part of parts) {
    const parsed = parseHeaders(part.trim());
    const partType = parsed.headers["content-type"] || "";
    if (partType.toLowerCase().includes("text/plain")) {
      return decodeTransfer(
        parsed.body,
        parsed.headers["content-transfer-encoding"],
      ).trim();
    }
  }
  return "";
}

export function summarizeEmail(raw) {
  const { headers, body } = parseHeaders(raw);
  return {
    from: decodeMimeWords(headers.from || ""),
    to: decodeMimeWords(headers.to || ""),
    subject: decodeMimeWords(headers.subject || ""),
    date: headers.date || "",
    body: extractText(headers, body).slice(0, 800),
  };
}

function encodeHeader(value) {
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function buildEmail({ from, to, subject, body, senderName }) {
  const formattedFrom = senderName ? `${encodeHeader(senderName)} <${from}>` : from;
  const headers = [
    `From: ${formattedFrom}`,
    `To: ${to.join(", ")}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${os.hostname()}>`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: 8bit",
  ];
  return `${headers.join("\r\n")}\r\n\r\n${body}\r\n`;
}

async function readSmtpResponse(reader) {
  const lines = [];
  while (true) {
    const line = await reader.readLine();
    lines.push(line);
    if (/^\d{3} /.test(line)) return lines;
  }
}

async function smtpCommand(socket, reader, command, expected) {
  socket.write(`${command}\r\n`);
  const lines = await readSmtpResponse(reader);
  const code = Number(lines.at(-1).slice(0, 3));
  if (!expected.includes(code)) {
    throw new Error(`SMTP command failed (${command}): ${lines.join(" | ")}`);
  }
  return lines;
}

export async function sendMail(config, { to, subject, body, senderName, forceSend = false }) {
  const dryRun = config.dryRun && !forceSend;
  if (dryRun) {
    return { sent: false, dryRun: true, from: config.address, to, subject };
  }

  const socket = tls.connect({
    host: config.smtpHost,
    port: config.smtpPort,
    servername: config.smtpHost,
  });
  await onceConnect(socket);
  const reader = new SocketReader(socket);
  await readSmtpResponse(reader);
  await smtpCommand(socket, reader, `EHLO ${os.hostname()}`, [250]);
  const auth = Buffer.from(`\u0000${config.address}\u0000${config.password}`).toString("base64");
  await smtpCommand(socket, reader, `AUTH PLAIN ${auth}`, [235]);
  await smtpCommand(socket, reader, `MAIL FROM:<${config.address}>`, [250]);
  for (const recipient of to) {
    await smtpCommand(socket, reader, `RCPT TO:<${recipient}>`, [250, 251]);
  }
  await smtpCommand(socket, reader, "DATA", [354]);
  const message = buildEmail({ from: config.address, to, subject, body, senderName });
  socket.write(`${message.replace(/^\./gm, "..")}\r\n.\r\n`);
  await readSmtpResponse(reader);
  await smtpCommand(socket, reader, "QUIT", [221]);
  socket.end();
  return { sent: true, dryRun: false, from: config.address, to, subject };
}

function printMessages(messages) {
  for (const message of messages) {
    console.log(`ID: ${message.id || ""}`);
    console.log(`Date: ${message.date}`);
    console.log(`From: ${message.from}`);
    console.log(`To: ${message.to}`);
    console.log(`Subject: ${message.subject}`);
    if (message.body) {
      console.log("Body:");
      console.log(message.body);
    }
    console.log("-".repeat(72));
  }
}

function parseArgs(argv) {
  const [command, ...tokens] = argv;
  const args = { _: [] };
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    if (["connect", "no-dry-run"].includes(key)) {
      args[key] = true;
      continue;
    }
    const value = tokens[++i];
    if (value === undefined) throw new Error(`Missing value for --${key}`);
    if (key === "to") {
      args.to = args.to || [];
      args.to.push(value);
    } else {
      args[key] = value;
    }
  }
  return { command, args };
}

function help() {
  console.log(`Alibaba Mail agent connector

Usage:
  node .\\src\\ali-mail-agent.mjs doctor [--connect]
  node .\\src\\ali-mail-agent.mjs folders --connect
  node .\\src\\ali-mail-agent.mjs latest [--mailbox INBOX] [--limit 5]
  node .\\src\\ali-mail-agent.mjs search [--from user@example.com] [--subject text] [--text text] [--limit 10]
  node .\\src\\ali-mail-agent.mjs send --to user@example.com --subject "Hello" --body "Body" [--no-dry-run]
`);
}

async function main(argv = process.argv.slice(2)) {
  const { command, args } = parseArgs(argv);
  if (!command || command === "--help" || command === "help") {
    help();
    return 0;
  }

  const config = getConfig();
  if (command === "doctor") {
    console.log("Config loaded");
    console.log(`Address: ${config.address}`);
    console.log(`IMAP: ${config.imapHost}:${config.imapPort}`);
    console.log(`SMTP: ${config.smtpHost}:${config.smtpPort}`);
    console.log(`Default mailbox: ${config.defaultMailbox}`);
    console.log(`Dry-run send: ${config.dryRun}`);
    console.log("Password: [redacted]");
    if (args.connect) {
      const client = await new ImapClient(config).connect();
      await client.command("NOOP");
      client.close();
      console.log("IMAP login: OK");
    }
    return 0;
  }

  if (command === "folders") {
    if (!args.connect) {
      console.log("Use --connect to query folders over IMAP.");
      return 0;
    }
    const client = await new ImapClient(config).connect();
    const folders = await client.listFolders();
    client.close();
    folders.forEach((folder) => console.log(folder));
    return 0;
  }

  if (command === "latest" || command === "search") {
    const client = await new ImapClient(config).connect();
    await client.select(args.mailbox || config.defaultMailbox);
    const criteria = command === "latest" ? ["ALL"] : buildSearchCriteria(args);
    const ids = await client.search(criteria);
    const limit = Number(args.limit || (command === "latest" ? 5 : 10));
    const messages = await client.fetchMessages(ids.slice(-limit).reverse());
    client.close();
    printMessages(messages);
    return 0;
  }

  if (command === "send") {
    if (!args.to?.length || !args.subject || !args.body) {
      throw new Error("send requires --to, --subject, and --body");
    }
    const result = await sendMail(config, {
      to: args.to,
      subject: args.subject,
      body: args.body,
      senderName: args["sender-name"],
      forceSend: Boolean(args["no-dry-run"]),
    });
    console.log(`Sent: ${result.sent}`);
    console.log(`Dry-run: ${result.dryRun}`);
    console.log(`From: ${result.from}`);
    console.log(`To: ${result.to.join(", ")}`);
    console.log(`Subject: ${result.subject}`);
    return 0;
  }

  throw new Error(`Unknown command: ${command}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
