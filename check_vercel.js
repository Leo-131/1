const https = require('https');

const options = {
  hostname: 'outreach-dashboard-woad-three.vercel.app',
  path: '/',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

https.get(options, (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('Status:', r.statusCode);
    console.log('Size:', Math.round(d.length / 1024), 'KB');
    const t = d.match(/<title>(.*?)<\/title>/);
    console.log('Title:', t ? t[1] : 'N/A');
    // Check for embedded data
    const hasEmbed = d.includes('EMBEDDED_DATA');
    console.log('Has EMBEDDED_DATA:', hasEmbed);
    // Count contacts
    const idCount = (d.match(/"id":/g) || []).length;
    console.log('Contact IDs found:', idCount);
    // Check version
    const v16 = d.match(/v16\.\d+/g);
    console.log('Version:', v16 ? [...new Set(v16)] : 'N/A');
    // Check if it has the old fetch-based data loading
    const hasFetch = d.includes("fetch('outreach_data.json'");
    console.log('Has fetch(outreach_data.json):', hasFetch);
    // Check contact names
    console.log('Has James Chen:', d.includes('James Chen'));
    console.log('Has Sheena Denmead:', d.includes('Sheena Denmead'));
    console.log('Has Diana Muller:', d.includes('Diana Muller'));
  });
}).on('error', e => console.log('Error:', e.message));
