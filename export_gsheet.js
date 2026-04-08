const fs = require('fs');

// 读取 JSON 数据
const data = JSON.parse(fs.readFileSync('outreach_data.json', 'utf8'));

// 导出 contacts 为 CSV
const contacts = data.contacts || [];
if (contacts.length > 0) {
    const headers = Object.keys(contacts[0]);
    const csvLines = [headers.join(',')];
    
    for (const c of contacts) {
        const row = headers.map(h => {
            let val = String(c[h] || '').replace(/,/g, ';').replace(/\n/g, ' ');
            return val;
        });
        csvLines.push(row.join(','));
    }
    
    fs.writeFileSync('contacts_export.csv', csvLines.join('\n'), 'utf8');
    console.log('✅ Contacts exported: contacts_export.csv');
}

// 导出 stats
const stats = data.stats || {};
if (Object.keys(stats).length > 0) {
    const statsLines = ['key,value'];
    for (const [k, v] of Object.entries(stats)) {
        statsLines.push(`${k},${String(v).replace(/,/g, ';')}`);
    }
    fs.writeFileSync('stats_export.csv', statsLines.join('\n'), 'utf8');
    console.log('✅ Stats exported: stats_export.csv');
}

// 导出 keyword_performance
const kwData = data.keyword_performance || {};
if (Object.keys(kwData).length > 0) {
    const kwLines = ['keyword,score,sent,label,platform'];
    for (const [k, v] of Object.entries(kwData)) {
        kwLines.push(`${k},${v.score||''},${v.sent||''},${(v.label||'').replace(/,/g, ';')},${v.platform||''}`);
    }
    fs.writeFileSync('keyword_export.csv', kwLines.join('\n'), 'utf8');
    console.log('✅ Keywords exported: keyword_export.csv');
}

// 导出 optimization_log
const logs = data.optimization_log || [];
if (logs.length > 0) {
    const logLines = ['version,date,change'];
    for (const l of logs) {
        logLines.push(`${l.version},${l.date},${(l.change||'').replace(/,/g, ';')}`);
    }
    fs.writeFileSync('log_export.csv', logLines.join('\n'), 'utf8');
    console.log('✅ Logs exported: log_export.csv');
}

console.log('\n🎉 All data exported!');