/**
 * Google Apps Script - Outreach Data Sync
 * 
 * 使用方法：
 * 1. 在 Google Sheets 中创建新表格
 * 2. 工具 > Apps Script
 * 3. 粘贴此代码
 * 4. 部署 > 新增部署 > Web 应用
 * 5. 设置：任何人可访问，执行身份：本人
 * 6. 复制 Web 应用 URL 到下方配置
 */

const CONFIG = {
  SHEET_NAME: 'Outreach Log',
  WEB_APP_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
};

// POST endpoint - 接收来自dashboard的数据
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME) || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.SHEET_NAME);
  
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 添加时间戳
    const now = new Date();
    
    // 写入统计
    const row = [
      now.toISOString(),
      data.today_sent || 0,
      data.total_sent || 0,
      data.accepted || 0,
      data.accept_rate || '0%',
      data.tier1 || 0,
      data.tier2 || 0,
      data.tier3 || 0,
      data.excluded || 0
    ];
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['时间戳', '今日发送', '累计发送', '接受数', '接受率', 'Tier1', 'Tier2', 'Tier3', '排除']);
    }
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET endpoint - 返回最新数据
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet || sheet.getLastRow() <= 1) {
    return ContentService.createTextOutput(JSON.stringify({data: []}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(lastRow, 1, 1, 9).getValues()[0];
  
  return ContentService.createTextOutput(JSON.stringify({
    timestamp: data[0],
    today_sent: data[1],
    total_sent: data[2],
    accepted: data[3],
    accept_rate: data[4],
    tier1: data[5],
    tier2: data[6],
    tier3: data[7],
    excluded: data[8]
  })).setMimeType(ContentService.MimeType.JSON);
}

// 测试函数
function testSync() {
  const testData = {
    timestamp: new Date().toISOString(),
    today_sent: 5,
    total_sent: 942,
    accepted: 24,
    accept_rate: '2.55',
    tier1: 3,
    tier2: 7,
    tier3: 14,
    excluded: 1
  };
  Logger.log('Test data prepared:', JSON.stringify(testData));
}
