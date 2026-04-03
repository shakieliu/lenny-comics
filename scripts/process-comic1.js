/**
 * Process comic_1 new panels: trim + WebP
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', '..', 'lenny-comics', 'comic_1_new');
const DEST = path.resolve(__dirname, '..', 'public', 'comics', 'comic_1');

async function main() {
  fs.mkdirSync(DEST, { recursive: true });
  
  const panels = fs.readdirSync(SRC).filter(f => /^panel_\d+\.png$/i.test(f)).sort();
  console.log(`Processing ${panels.length} panels from ${SRC}`);
  
  for (const panel of panels) {
    const src = path.join(SRC, panel);
    const destName = panel.replace(/\.png$/i, '.webp');
    const dest = path.join(DEST, destName);
    
    await sharp(src)
      .trim({ threshold: 30 })
      .webp({ quality: 80 })
      .toFile(dest);
    
    const srcStat = fs.statSync(src);
    const destStat = fs.statSync(dest);
    const ratio = ((1 - destStat.size / srcStat.size) * 100).toFixed(1);
    console.log(`  ${panel} → ${destName} (${ratio}% smaller)`);
  }
  
  console.log('\nDone! comic_1 panels processed.');
}

main().catch(console.error);
