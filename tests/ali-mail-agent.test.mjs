import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  loadDotenv,
  sendMail,
  summarizeEmail,
} from "../src/ali-mail-agent.mjs";

test("loadDotenv does not override existing environment values", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ali-mail-"));
  const file = path.join(dir, ".env");
  fs.writeFileSync(file, "ALI_MAIL_ADDRESS=local@example.com\nALI_MAIL_PASSWORD=secret\n");

  const previousAddress = process.env.ALI_MAIL_ADDRESS;
  const previousPassword = process.env.ALI_MAIL_PASSWORD;
  process.env.ALI_MAIL_ADDRESS = "existing@example.com";
  delete process.env.ALI_MAIL_PASSWORD;

  loadDotenv(file);

  assert.equal(process.env.ALI_MAIL_ADDRESS, "existing@example.com");
  assert.equal(process.env.ALI_MAIL_PASSWORD, "secret");

  if (previousAddress === undefined) delete process.env.ALI_MAIL_ADDRESS;
  else process.env.ALI_MAIL_ADDRESS = previousAddress;
  if (previousPassword === undefined) delete process.env.ALI_MAIL_PASSWORD;
  else process.env.ALI_MAIL_PASSWORD = previousPassword;
});

test("summarizeEmail decodes MIME subject and body", () => {
  const raw = [
    "From: Sender <sender@example.com>",
    "To: leo@flextailgear.com",
    "Subject: =?utf-8?B?5rWL6K+V6YKu5Lu2?=",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "hello",
  ].join("\r\n");

  const summary = summarizeEmail(raw);
  assert.equal(summary.subject, "测试邮件");
  assert.equal(summary.body, "hello");
});

test("sendMail defaults to dry-run", async () => {
  const result = await sendMail(
    {
      address: "leo@flextailgear.com",
      password: "unused",
      smtpHost: "smtp.sg.aliyun.com",
      smtpPort: 465,
      dryRun: true,
    },
    {
      to: ["person@example.com"],
      subject: "Subject",
      body: "Body",
    },
  );

  assert.equal(result.sent, false);
  assert.equal(result.dryRun, true);
  assert.equal(result.from, "leo@flextailgear.com");
});
