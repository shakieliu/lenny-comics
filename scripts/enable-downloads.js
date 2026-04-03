// Enable downloads via CDP then trigger them
const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');

const CDP_URL = 'http://127.0.0.1:18800';
const DOWNLOAD_DIR = path.join(process.env.USERPROFILE, 'Downloads');
const TARGET_ID = '2020C76247812ACC25C2CEEBC9D79A7C';

function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get(`${CDP_URL}/json`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const targets = JSON.parse(d);
        const t = targets.find(x => x.id === TARGET_ID || x.targetId === TARGET_ID || (x.url && x.url.includes('storyboarder.io')));
        if (t) resolve(t.webSocketDebuggerUrl);
        else reject(new Error('Target not found'));
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
  console.log('Connecting to', wsUrl);
  
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.on('open', r));
  console.log('Connected');

  // Enable download behavior
  console.log('Setting download behavior...');
  await cdpCall(ws, 'Browser.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR
  }, 1);
  console.log('Downloads enabled to', DOWNLOAD_DIR);

  // Also try Page.setDownloadBehavior
  try {
    await cdpCall(ws, 'Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_DIR
    }, 2);
    console.log('Page download behavior set');
  } catch(e) {
    console.log('Page.setDownloadBehavior not available, continuing...');
  }

  // Now trigger downloads via JS
  console.log('Triggering downloads...');
  await cdpCall(ws, 'Runtime.evaluate', {
    expression: `
      (function() {
        const imgs = document.querySelectorAll('img[src^="data:image"]');
        for (let i = 0; i < imgs.length; i++) {
          const a = document.createElement('a');
          a.href = imgs[i].src;
          a.download = 'panel_' + (i + 1) + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        return 'Triggered ' + imgs.length + ' downloads';
      })()
    `
  }, 3);
  console.log('Downloads triggered, waiting...');
  
  // Wait for downloads
  await new Promise(r => setTimeout(r, 15000));
  
  // Check
  const files = fs.readdirSync(DOWNLOAD_DIR).filter(f => f.match(/^panel_\d+\.png$/));
  console.log('Found files:', files);
  
  ws.close();
}

main().catch(e => { console.error(e); process.exit(1); });
