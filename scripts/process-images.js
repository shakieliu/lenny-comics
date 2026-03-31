/**
 * Image Preprocessing Script for Lenny Comics
 * - Trims white borders (keeps black-framed content)
 * - Converts to WebP with quality optimization
 * - Outputs to public/comics/comic_N/
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const COMICS_SRC = path.resolve(__dirname, '..', '..', 'lenny-comics');
const COMICS_DEST = path.resolve(__dirname, '..', 'public', 'comics');
const WEBP_QUALITY = 80;

async function processImage(srcPath, destPath) {
  await sharp(srcPath)
    .trim({ threshold: 30 }) // trim near-white borders
    .webp({ quality: WEBP_QUALITY })
    .toFile(destPath);

  const srcStat = fs.statSync(srcPath);
  const destStat = fs.statSync(destPath);
  const ratio = ((1 - destStat.size / srcStat.size) * 100).toFixed(1);
  console.log(`  ${path.basename(srcPath)} → ${path.basename(destPath)} (${ratio}% smaller)`);
}

async function main() {
  // Find all comic_N directories (skip doodle/fix variants)
  const dirs = fs.readdirSync(COMICS_SRC)
    .filter(d => /^comic_\d+$/.test(d))
    .sort((a, b) => {
      const na = parseInt(a.split('_')[1]);
      const nb = parseInt(b.split('_')[1]);
      return na - nb;
    });

  console.log(`Found ${dirs.length} comic folders\n`);

  for (const dir of dirs) {
    const srcDir = path.join(COMICS_SRC, dir);
    const destDir = path.join(COMICS_DEST, dir);
    fs.mkdirSync(destDir, { recursive: true });

    const panels = fs.readdirSync(srcDir)
      .filter(f => /^panel_\d+\.png$/i.test(f))
      .sort();

    console.log(`${dir} (${panels.length} panels):`);

    for (const panel of panels) {
      const srcPath = path.join(srcDir, panel);
      const destName = panel.replace(/\.png$/i, '.webp');
      const destPath = path.join(destDir, destName);

      try {
        await processImage(srcPath, destPath);
      } catch (err) {
        console.error(`  ERROR processing ${panel}: ${err.message}`);
      }
    }
    console.log('');
  }

  console.log('Done! All images processed.');
}

main().catch(console.error);
