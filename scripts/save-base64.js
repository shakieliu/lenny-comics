// Helper script to save base64 image data from stdin
const fs = require('fs');
const dest = process.argv[2];
if (!dest) { console.error('Usage: node save-base64.js <output-path>'); process.exit(1); }

let data = '';
process.stdin.on('data', chunk => { data += chunk; });
process.stdin.on('end', () => {
  const buf = Buffer.from(data.trim(), 'base64');
  fs.writeFileSync(dest, buf);
  console.log(`Saved ${buf.length} bytes to ${dest}`);
});
