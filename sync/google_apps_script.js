/**
 * Vercel 看板与 Google Sheet 双向同步
 * 
 * 功能：
 * 1. 从 GitHub 获取 outreach_data.json 数据
 * 2. 对比 Sheet 现有数据，合并更新
 * 3. 将 Sheet 更新写回 GitHub
 * 
 * 使用方法：
 * 1. 打开 Google Sheet -> 扩展程序 -> Apps Script
 * 2. 粘贴此代码
 * 3. 设置 CONFIG 中的参数
 * 4. 运行 setupSheetHeaders() 初始化表头
 * 5. 运行 syncFromGitHub() 或 syncToGitHub()
 */

// ============ 配置区域 ============
const CONFIG = {
  // GitHub 配置 - 请在此处填入你的GitHub Token
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE', // 替换为你的 GitHub Personal Access Token
  GITHUB_OWNER: 'Leo-131',
  GITHUB_REPO: '1',
  GITHUB_FILE_PATH: 'outreach_data.json',
  
  // Sheet 配置
  SHEET_NAME: 'outreach_data',
  DATA_START_ROW: 2, // 数据起始行（表头为第1行）
  
  // 列映射（Sheet 列顺序）
  COLUMNS: {
    id: 1,
    name: 2,
    company: 3,
    role: 4,
    category: 5,
    ka_flag: 6,
    priority: 7,
    status: 8,
    keyword_used: 9,
    message: 10
  }
};

// ============ 核心功能 ============

/**
 * 初始化 Sheet 表头
 */
function setupSheetHeaders() {
  const sheet = getOrCreateSheet();
  const headers = ['id', 'name', 'company', 'role', 'category', 'ka_flag', 'priority', 'status', 'keyword_used', 'message'];
  
  // 清除现有内容并设置表头
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // 设置表头样式
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setHorizontalAlignment('center');
  
  // 设置列宽
  sheet.setColumnWidth(1, 80);  // id
  sheet.setColumnWidth(2, 120); // name
  sheet.setColumnWidth(3, 180); // company
  sheet.setColumnWidth(4, 120); // role
  sheet.setColumnWidth(5, 100); // category
  sheet.setColumnWidth(6, 80);  // ka_flag
  sheet.setColumnWidth(7, 80);  // priority
  sheet.setColumnWidth(8, 100); // status
  sheet.setColumnWidth(9, 200); // keyword_used
  sheet.setColumnWidth(10, 300); // message
  
  Logger.log('表头初始化完成');
}

/**
 * 从 GitHub 获取数据并同步到 Sheet
 */
function syncFromGitHub() {
  const data = fetchGitHubJson();
  
  if (!data) {
    Logger.log('获取 GitHub 数据失败');
    return;
  }
  
  const sheet = getOrCreateSheet();
  
  // 确保表头存在
  if (sheet.getLastRow() === 0) {
    setupSheetHeaders();
  }
  
  // 转换数据为 Sheet 格式
  const rows = data.map(item => [
    item.id || '',
    item.name || '',
    item.company || '',
    item.role || '',
    item.category || '',
    item.ka_flag || false,
    item.priority || '',
    item.status || '',
    item.keyword_used || '',
    item.message || ''
  ]);
  
  // 清除旧数据（保留表头）
  const lastRow = Math.max(sheet.getLastRow(), 1);
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 10).clearContent();
  }
  
  // 写入新数据
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 10).setValues(rows);
  }
  
  Logger.log(`成功同步 ${rows.length} 条数据到 Sheet`);
  return rows.length;
}

/**
 * 从 Sheet 获取数据并同步到 GitHub
 */
function syncToGitHub() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    Logger.log('Sheet 中没有数据');
    return;
  }
  
  // 读取 Sheet 数据
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 10);
  const values = dataRange.getValues();
  
  // 转换为 JSON 格式
  const data = values.map((row, index) => ({
    id: String(row[0]) || `item_${index + 1}`,
    name: String(row[1]) || '',
    company: String(row[2]) || '',
    role: String(row[3]) || '',
    category: String(row[4]) || '',
    ka_flag: Boolean(row[5]),
    priority: String(row[6]) || '',
    status: String(row[7]) || '',
    keyword_used: String(row[8]) || '',
    message: String(row[9]) || ''
  })).filter(item => item.name || item.company); // 过滤空行
  
  // 推送到 GitHub
  const success = pushToGitHub(data);
  
  if (success) {
    Logger.log(`成功推送 ${data.length} 条数据到 GitHub`);
  }
  
  return data.length;
}

/**
 * 双向同步（Sheet 为主）
 * Sheet 有变更时同步到 GitHub
 */
function bidirectionalSync() {
  // 1. 从 GitHub 获取最新数据
  const githubData = fetchGitHubJson() || [];
  
  // 2. 获取 Sheet 数据
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  
  let sheetData = [];
  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
    sheetData = values.map((row, index) => ({
      id: String(row[0]) || `item_${index + 1}`,
      name: String(row[1]) || '',
      company: String(row[2]) || '',
      role: String(row[3]) || '',
      category: String(row[4]) || '',
      ka_flag: Boolean(row[5]),
      priority: String(row[6]) || '',
      status: String(row[7]) || '',
      keyword_used: String(row[8]) || '',
      message: String(row[9]) || ''
    })).filter(item => item.name || item.company);
  }
  
  // 3. 创建 ID 索引
  const githubById = {};
  githubData.forEach(item => githubById[item.id] = item);
  
  const sheetById = {};
  sheetData.forEach(item => sheetById[item.id] = item);
  
  // 4. 合并数据（Sheet 数据优先）
  const mergedData = [];
  const allIds = new Set([...Object.keys(githubById), ...Object.keys(sheetById)]);
  
  allIds.forEach(id => {
    const githubItem = githubById[id];
    const sheetItem = sheetById[id];
    
    if (sheetItem) {
      // Sheet 中存在，使用 Sheet 数据
      mergedData.push(sheetItem);
    } else if (githubItem) {
      // 仅 GitHub 存在，保留
      mergedData.push(githubItem);
    }
  });
  
  // 5. 更新 Sheet
  if (sheet.getLastRow() === 0) {
    setupSheetHeaders();
  }
  
  // 清除并重写
  const existingLastRow = Math.max(sheet.getLastRow(), 1);
  if (existingLastRow > 1) {
    sheet.getRange(2, 1, existingLastRow - 1, 10).clearContent();
  }
  
  const rows = mergedData.map(item => [
    item.id, item.name, item.company, item.role, item.category,
    item.ka_flag, item.priority, item.status, item.keyword_used, item.message
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 10).setValues(rows);
  }
  
  // 6. 推送到 GitHub
  pushToGitHub(mergedData);
  
  Logger.log(`双向同步完成: ${rows.length} 条数据`);
  return rows.length;
}

// ============ 辅助函数 ============

/**
 * 获取或创建 Sheet
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.createSheet(CONFIG.SHEET_NAME);
  }
  
  return sheet;
}

/**
 * 从 GitHub 获取 JSON 数据
 */
function fetchGitHubJson() {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.GITHUB_FILE_PATH}`;
  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const content = JSON.parse(response.getContentText());
    
    // 解码 base64 内容
    const decoded = Utilities.newBlob(Utilities.base64Decode(content.content), 'application/json', 'data.json');
    const jsonString = decoded.getDataAsString();
    
    return JSON.parse(jsonString);
  } catch (error) {
    Logger.log('获取 GitHub 数据失败: ' + error.toString());
    return null;
  }
}

/**
 * 推送数据到 GitHub
 */
function pushToGitHub(data) {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.GITHUB_FILE_PATH}`;
  
  // 1. 获取当前文件的 SHA
  let sha = null;
  try {
    const getOptions = {
      method: 'GET',
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    const response = UrlFetchApp.fetch(url, getOptions);
    const content = JSON.parse(response.getContentText());
    sha = content.sha;
  } catch (error) {
    Logger.log('获取文件 SHA 失败（文件可能不存在）: ' + error.toString());
  }
  
  // 2. 编码内容
  const jsonContent = JSON.stringify(data, null, 2);
  const encodedContent = Utilities.base64Encode(jsonContent);
  
  // 3. 构建请求体
  const body = {
    message: 'Sync from Google Sheet - ' + new Date().toISOString(),
    content: encodedContent,
    branch: 'main'
  };
  
  if (sha) {
    body.sha = sha;
  }
  
  // 4. 推送
  const options = {
    method: 'PUT',
    headers: {
      'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(body)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    Logger.log('GitHub 推送成功: ' + result.commit.sha);
    return true;
  } catch (error) {
    Logger.log('GitHub 推送失败: ' + error.toString());
    return false;
  }
}

/**
 * 创建触发器 - 每10分钟自动同步
 */
function createTimeDrivenTriggers() {
  // 删除现有触发器
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // 创建新的时间触发器（每10分钟）
  ScriptApp.newTrigger('bidirectionalSync')
    .timeBased()
    .everyMinutes(10)
    .create();
  
  Logger.log('已创建每10分钟自动同步触发器');
}

/**
 * 删除所有触发器
 */
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log('已删除所有触发器');
}

// ============ 菜单 ============
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 同步设置')
    .addItem('📥 从 GitHub 同步到 Sheet', 'syncFromGitHub')
    .addItem('📤 从 Sheet 同步到 GitHub', 'syncToGitHub')
    .addItem('🔄 双向同步（推荐）', 'bidirectionalSync')
    .addSeparator()
    .addItem('⚙️ 初始化表头', 'setupSheetHeaders')
    .addItem('⏰ 创建自动同步触发器', 'createTimeDrivenTriggers')
    .addItem('🗑️ 删除所有触发器', 'deleteAllTriggers')
    .addToUi();
}
