// Script to extract base64 panel data from storyboarder via CDP
// Usage: node extract-panels.js <output-dir>
const fs = require('fs');
const http = require('http');

const outputDir = process.argv[2] || 'C:\\Users\\shakieliu\\.openclaw\\workspace\\lenny-comics\\comic_1_new';

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

// Connect to CDP
const CDP_URL = 'http://127.0.0.1:18800';

async function getTargets() {
  return new Promise((resolve, reject) => {
    http.get(`${CDP_URL}/json`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function sendCDP(wsUrl, method, params = {}) {
  const WebSocket = require('ws');
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Date.now();
    ws.on('open', () => {
      ws.send(JSON.stringify({ id, method, params }));
    });
    ws.on('message', data => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.close();
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  try {
    const targets = await getTargets();
    const storyboarder = targets.find(t => t.url.includes('storyboarder.io'));
    if (!storyboarder) {
      console.error('Storyboarder tab not found!');
      process.exit(1);
    }
    
    console.log('Found storyboarder tab:', storyboarder.title);
    const wsUrl = storyboarder.webSocketDebuggerUrl;
    
    // Get the number of panels
    const countResult = await sendCDP(wsUrl, 'Runtime.evaluate', {
      expression: `document.querySelectorAll('img[src^="data:image"]').length`
    });
    const panelCount = countResult.result.value;
    console.log(`Found ${panelCount} panels`);
    
    for (let i = 0; i < panelCount; i++) {
      console.log(`Extracting panel ${i + 1}...`);
      
      // Get base64 data
      const dataResult = await sendCDP(wsUrl, 'Runtime.evaluate', {
        expression: `document.querySelectorAll('img[src^="data:image"]')[${i}].src.substring(document.querySelectorAll('img[src^="data:image"]')[${i}].src.indexOf(',') + 1)`,
        returnByValue: true
      });
      
      const base64Data = dataResult.result.value;
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = `${outputDir}\\panel_${i + 1}.png`;
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved panel ${i + 1}: ${buffer.length} bytes -> ${filePath}`);
    }
    
    console.log('All panels extracted successfully!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
