import { execSync } from 'child_process';

const FILE_ID = 'ELr1wYBc91MHygQrppu5rxtM2RmszAsLf';
const sheets = [
  { name: '郑帅', sheetId: 21, maxRow: 153, maxCol: 13 },
  { name: '刘玉杰', sheetId: 1, maxRow: 21, maxCol: 9 },
  { name: '刘慧', sheetId: 18, maxRow: 25, maxCol: 8 },
  { name: '刘星麟', sheetId: 19, maxRow: 151, maxCol: 13 },
  { name: '刘妮妮', sheetId: 20, maxRow: 67, maxCol: 8 },
];

const BATCH_SIZE = 50;
const DELAY_MS = 3000;

function callMcporter(sheetId, rowFrom, rowTo, colFrom, colTo) {
  // Use escaped double quotes for PowerShell compatibility
  const argsStr = `{\"range\":{\"rowFrom\":${rowFrom},\"rowTo\":${rowTo},\"colFrom\":${colFrom},\"colTo\":${colTo}}}`;
  const cmd = `npx mcporter call kdocs-qclaw sheet.get_range_data file_id="${FILE_ID}" sheetId=${sheetId} --args '${argsStr}'`;
  try {
    const result = execSync(cmd, { encoding: 'utf-8', timeout: 120000, stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(result);
  } catch (e) {
    // execSync throws on stderr output even if exit code 0
    // Try to parse the stdout from the error
    if (e.stdout) {
      try { return JSON.parse(e.stdout); } catch {}
    }
    throw e;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchSheet(sheet) {
  const rows = [];
  let rowFrom = 1;
  
  while (rowFrom <= sheet.maxRow) {
    const rowTo = Math.min(rowFrom + BATCH_SIZE - 1, sheet.maxRow);
    console.error(`[${sheet.name}] Fetching rows ${rowFrom}-${rowTo}...`);
    
    try {
      const resp = callMcporter(sheet.sheetId, rowFrom, rowTo, 0, sheet.maxCol);
      
      if (resp.code !== 0) {
        console.error(`[${sheet.name}] Error at rows ${rowFrom}-${rowTo}: ${resp.message}`);
        if (resp.message && String(resp.message).includes('429')) {
          console.error('Rate limited, waiting 10s...');
          await sleep(10000);
          continue;
        }
        break;
      }
      
      const cells = resp.data?.detail?.rangeData || [];
      const rowData = {};
      for (const cell of cells) {
        const row = cell.originRow;
        const col = cell.originCol;
        if (!rowData[row]) rowData[row] = {};
        rowData[row][col] = cell.cellText || '';
      }
      
      for (const [rowIdx, cols] of Object.entries(rowData)) {
        rows.push(cols);
      }
      
      rowFrom = rowTo + 1;
      console.error(`[${sheet.name}] Got ${cells.length} cells, total rows so far: ${rows.length}`);
      
      if (rowFrom <= sheet.maxRow) {
        await sleep(DELAY_MS);
      }
    } catch (e) {
      console.error(`[${sheet.name}] Exception: ${e.message.substring(0, 200)}`);
      break;
    }
  }
  
  return rows;
}

async function main() {
  const allData = {};
  
  for (const sheet of sheets) {
    console.error(`\n=== ${sheet.name} (sheetId=${sheet.sheetId}, rows: 1-${sheet.maxRow}) ===`);
    const rows = await fetchSheet(sheet);
    allData[sheet.name] = rows;
    console.error(`[${sheet.name}] Total: ${rows.length} rows`);
    
    if (sheet !== sheets[sheets.length - 1]) {
      await sleep(DELAY_MS);
    }
  }
  
  console.log(JSON.stringify(allData));
}

main().catch(e => { console.error(e); process.exit(1); });
