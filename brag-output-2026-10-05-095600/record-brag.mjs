/**
 * record-brag.mjs — Puppeteer-core + ffmpeg MP4 renderer
 * Opens the HTML composition in system Chrome, captures 30fps screenshots
 * for 21 seconds, then stitches into a crisp MP4 with ffmpeg.
 */
import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const HTML_FILE  = path.resolve(__dirname, 'composition/index.html');
const FRAMES_DIR = path.join(__dirname, 'frames');
const MP4_OUT    = path.join(__dirname, 'brag.mp4');
const FPS        = 30;
const DURATION_S = 21;
const TOTAL_FRAMES = FPS * DURATION_S;

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

console.log('🎬  Threat Zone — Brag Video Renderer');
console.log(`    ${TOTAL_FRAMES} frames @ ${FPS}fps → ${MP4_OUT}\n`);

// Reset frames directory
if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  defaultViewport: { width: 1920, height: 1080 },
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--allow-file-access-from-files',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--font-render-hinting=none',
    '--disable-font-subpixel-positioning',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

const url = `file:///${HTML_FILE.replace(/\\/g, '/')}`;
console.log('    Loading:', url);
await page.goto(url, { waitUntil: 'load', timeout: 30000 });

// Wait for fonts + give extra settle time
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 1200));


// Trigger animation start (simulates click to unlock audio)
await page.evaluate(() => {
  document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});

// Small settle
await new Promise(r => setTimeout(r, 100));

console.log('    Capturing frames...');
const captureStart = Date.now();

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(5, '0')}.png`);
  await page.screenshot({ path: framePath, type: 'png', captureBeyondViewport: false });

  if (i % FPS === 0) {
    process.stdout.write(`\r    Frame ${i}/${TOTAL_FRAMES} — ${Math.round(i / FPS)}s elapsed`);
  }

  // Throttle to ~30fps real-time so the animation advances correctly
  const expectedTime = captureStart + (i + 1) * (1000 / FPS);
  const now = Date.now();
  if (expectedTime > now) await new Promise(r => setTimeout(r, expectedTime - now));
}

process.stdout.write('\n');
await browser.close();
console.log('    Browser closed. Encoding MP4...\n');

// Stitch with ffmpeg → H.264 MP4
const ffCmd = [
  'ffmpeg', '-y',
  '-framerate', FPS,
  '-i', `"${path.join(FRAMES_DIR, 'frame_%05d.png')}"`,
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '16',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  `"${MP4_OUT}"`
].join(' ');

console.log('   ', ffCmd);
execSync(ffCmd, { stdio: 'inherit' });

// Clean up frame images
fs.rmSync(FRAMES_DIR, { recursive: true });

const sizeMB = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(1);
console.log(`\n✅  Done!  ${MP4_OUT}  (${sizeMB} MB)`);
