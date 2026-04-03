// Download specific panel(s) from Storyboarder via CDP
const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');

const CDP_URL = 'http://127.0.0.1:18800';
const DOWNLOAD_DIR = path.join(process.env.USERPROFILE, 'Downloads');
const PANEL_INDEX = parseInt(process.argv[2] || '3'); // 0-based, so 3 = panel 4
const FILENAME = process.argv[3] || 'panel_4.png';

function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get(`${CDP_URL}/json`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const targets = JSON.parse(d);
        const t = targets.find(x => x.url && x.url.includes('storyboarder.io'));
        if (t) resolve(t.webSocketDebuggerUrl);
        else reject(new Error('Storyboarder tab not found'));
      });
    }).on('error', reject);
  });
}

function cdpCall(ws, method, params, id) {
  return new Promise((resolve, reject) => {
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.removeListener('message', handler);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.on('open', r));

  // Enable downloads
  await cdpCall(ws, 'Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR }, 1);
  await cdpCall(ws, 'Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR }, 2).catch(() => {});

  // Trigger download for specific panel
  await cdpCall(ws, 'Runtime.evaluate', {
    expression: `
      (function() {
        const imgs = document.querySelectorAll('img[src^="data:image"]');
        const img = imgs[${PANEL_INDEX}];
        if (!img) return 'Panel not found';
        const a = document.createElement('a');
        a.href = img.src;
        a.download = '${FILENAME}';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return 'Downloaded ${FILENAME}';
      })()
    `
  }, 3);

  console.log('Download triggered: ' + FILENAME);
  await new Promise(r => setTimeout(r, 5000));
  
  const filePath = path.join(DOWNLOAD_DIR, FILENAME);
  if (fs.existsSync(filePath)) {
    console.log(`OK: ${filePath} (${(fs.statSync(filePath).size / 1024).toFixed(0)} KB)`);
  } else {
    console.log('WARN: File not found yet, may still be downloading');
  }

  ws.close();
}

main().catch(e => { console.error(e); process.exit(1); });
