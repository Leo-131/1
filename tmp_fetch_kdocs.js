// Batch fetch all 5 Canton Fair sheets via mcporter
// Uses spawnSync with shell:false to avoid PowerShell quoting issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = 'ELr1wYBc91MHygQrppu5rxtM2RmszAsLf';
const sheets = [
  { name: '郑帅', sheetId: 21, maxRow: 153, maxCol: 13 },
  { name: '刘玉杰', sheetId: 1, maxRow: 21, maxCol: 9 },
  { name: '刘慧', sheetId: 18, maxRow: 25, maxCol: 8 },
  { name: '刘星麟', sheetId: 19, maxRow: 151, maxCol: 13 },
  { name: '刘妮妮', sheetId: 20, maxRow: 67, maxCol: 8 },
];

const BATCH_SIZE = 30; // Smaller batches for large file
const DELAY_MS = 4000;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function callMcporter(sheetId, rowFrom, rowTo, colFrom, colTo) {
  // Write args JSON to temp file, pass via stdin pipe approach
  // Actually, let's use the working approach: single-quoted --args with escaped JSON
  const jsonStr = JSON.stringify({ range: { rowFrom, rowTo, colFrom, colTo } });
  // For cmd.exe (which Node spawnSync uses with shell:true on Windows):
  // We need to pass the JSON properly. Let's write to a temp file and use a helper.
  const tmpFile = path.join(__dirname, '_mc_args_tmp.json');
  fs.writeFileSync(tmpFile, jsonStr, 'utf8');
  
  // Use cmd.exe /c with proper quoting
  const cmd = `npx mcporter call kdocs-qclaw sheet.get_range_data file_id=${FILE_ID} sheetId=${sheetId} "--args" "${jsonStr.replace(/"/g, '\\"')}" --output json --timeout 180000`;
  
  try {
    const result = execSync(cmd, { 
      encoding: 'utf-8', 
      timeout: 180000,
      shell: 'cmd.exe',
    });
    return JSON.parse(result.trim());
  } catch (e) {
    const out = (e.stdout || '').trim();
    if (out) {
      try { return JSON.parse(out); } catch {}
    }
    throw new Error(`stderr: ${(e.stderr || '').substring(0, 300)}, stdout: ${out.substring(0, 300)}`);
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}

async function fetchSheet(sheet) {
  const rows = [];
  let rowFrom = 1;
  
  while (rowFrom <= sheet.maxRow) {
    const rowTo = Math.min(rowFrom + BATCH_SIZE - 1, sheet.maxRow);
    console.error(`[${sheet.name}] rows ${rowFrom}-${rowTo}...`);
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = callMcporter(sheet.sheetId, rowFrom, rowTo, 0, sheet.maxCol);
        
        if (resp.code !== 0) {
          const msg = resp.message || '';
          console.error(`[${sheet.name}] Error code=${resp.code}: ${msg}`);
          if (msg.includes('429') || msg.includes('限频')) {
            console.error('Rate limited, waiting 15s...');
            await sleep(15000);
            continue;
          }
          break;
        }
        
        const cells = resp.data?.detail?.rangeData || [];
        const rowData = {};
        for (const cell of cells) {
          const r = cell.originRow;
          if (!rowData[r]) rowData[r] = {};
          rowData[r][cell.originCol] = cell.cellText || '';
        }
        
        let added = 0;
        for (const [ri, cols] of Object.entries(rowData)) {
          const vals = Object.values(cols).filter(v => v && v.trim() && !v.startsWith('=DISPIMG'));
          if (vals.length > 0) {
            rows.push(cols);
            added++;
          }
        }
        
        console.error(`[${sheet.name}] +${added} rows (total=${rows.length})`);
        rowFrom = rowTo + 1;
        break;
      } catch (e) {
        console.error(`[${sheet.name}] Attempt ${attempt+1} failed: ${e.message.substring(0, 200)}`);
        if (attempt < 2) {
          await sleep(10000);
        } else {
          console.error(`[${sheet.name}] Skipping remaining rows from ${rowFrom}`);
          rowFrom = sheet.maxRow + 1; // Give up on this sheet
        }
      }
    }
    
    if (rowFrom <= sheet.maxRow) {
      await sleep(DELAY_MS);
    }
  }
  
  return rows;
}

async function main() {
  const allData = {};
  
  for (const sheet of sheets) {
    console.error(`\n=== ${sheet.name} ===`);
    const rows = await fetchSheet(sheet);
    allData[sheet.name] = rows;
    console.error(`[${sheet.name}] DONE: ${rows.length} rows`);
    
    if (sheet !== sheets[sheets.length - 1]) {
      await sleep(DELAY_MS);
    }
  }
  
  // Save compact data - only cellText per cell
  const compact = {};
  for (const [name, rows] of Object.entries(allData)) {
    compact[name] = rows.map(row => {
      const obj = {};
      for (const [col, val] of Object.entries(row)) {
        if (val && val.trim() && !val.startsWith('=DISPIMG')) {
          obj[col] = val.trim();
        }
      }
      return obj;
    });
  }
  
  const outFile = path.join(__dirname, 'cantonfair_raw_data.json');
  fs.writeFileSync(outFile, JSON.stringify(compact, null, 2), 'utf8');
  console.error(`\nSaved to ${outFile}`);
  console.log(JSON.stringify(compact));
}

main().catch(e => { console.error(e.message); process.exit(1); });
