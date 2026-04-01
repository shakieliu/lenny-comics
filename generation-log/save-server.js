const http = require('http');
const fs = require('fs');
const path = require('path');
const baseDir = 'C:\\Users\\shakieliu\\.openclaw\\workspace\\lenny-comics-site\\generation-log';

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }
  if (req.method === 'POST' && req.url === '/save-image') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { comic, panel, data } = JSON.parse(body);
        const dir = path.join(baseDir, `comic_${comic}`);
        fs.mkdirSync(dir, { recursive: true });
        const fname = `panel_${panel}.png`;
        fs.writeFileSync(path.join(dir, fname), Buffer.from(data, 'base64'));
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        res.end('ok');
        console.log(`Saved comic_${comic}/${fname} (${Math.round(data.length/1024)}KB b64)`);
      } catch(e) {
        res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
        res.end(e.message);
        console.error(e);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});
server.listen(19876, () => console.log('Image save server on :19876'));
server.timeout = 120000;
