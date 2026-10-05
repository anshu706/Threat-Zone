/**
 * record-brag-cdp.mjs
 * Connects to an already-running Chrome (port 9222) via CDP,
 * takes 30fps screenshots for 21s, stitches with ffmpeg → MP4.
 */
import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.join(__dirname, 'frames');
const MP4_OUT    = path.join(__dirname, 'brag.mp4');
const FPS        = 25;
const DURATION_S = 22;
const TOTAL_FRAMES = FPS * DURATION_S;

console.log('🎬  Threat Zone — CDP Screenshot Renderer');
console.log(`    ${TOTAL_FRAMES} frames @ ${FPS}fps → ${MP4_OUT}\n`);

// Clean frames dir
if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR);

// Connect to already-running Chrome
const browser = await puppeteer.connect({
  browserURL: 'http://localhost:9222',
  defaultViewport: null,
});

// Get the existing page (our composition)
const pages = await browser.pages();
let page = pages.find(p => p.url().includes('index.html') || p.url().includes('composition'));
if (!page) {
  page = pages[0];
  console.log('    Using first page:', page.url());
} else {
  console.log('    Found composition page:', page.url());
}

// Set explicit viewport
await page.setViewport({ width: 1920, height: 1080 });
await new Promise(r => setTimeout(r, 500));

// Reload to restart animation from the beginning
console.log('    Reloading page to restart animation...');
await page.reload({ waitUntil: 'load', timeout: 15000 });

// Wait for fonts and initial render
try { await page.evaluate(() => document.fonts.ready); } catch(e) {}
await new Promise(r => setTimeout(r, 1500));

// Simulate click to start any click-gated logic
await page.evaluate(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));
await new Promise(r => setTimeout(r, 100));

console.log('    Capturing frames...');
const captureStart = Date.now();

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(5, '0')}.png`);

  try {
    const buf = await page.screenshot({ type: 'png', captureBeyondViewport: false });
    fs.writeFileSync(framePath, buf);
  } catch (e) {
    // Write blank frame if screenshot fails
    console.error(`\n    Frame ${i} error: ${e.message}`);
    if (i > 0) fs.copyFileSync(path.join(FRAMES_DIR, `frame_${String(i-1).padStart(5,'0')}.png`), framePath);
  }

  if (i % FPS === 0) {
    process.stdout.write(`\r    Frame ${i}/${TOTAL_FRAMES} — ${Math.round(i/FPS)}s`);
  }

  // Pace to ~25fps real-time so animation advances correctly
  const expected = captureStart + (i + 1) * (1000 / FPS);
  const delay = expected - Date.now();
  if (delay > 0) await new Promise(r => setTimeout(r, delay));
}

process.stdout.write('\n');
console.log('\n    All frames captured. Disconnecting...');
browser.disconnect();

// Check we have frames
const frameCount = fs.readdirSync(FRAMES_DIR).length;
console.log(`    Total frames saved: ${frameCount}`);

if (frameCount === 0) {
  console.error('❌  No frames were saved. Aborting.');
  process.exit(1);
}

// Encode with ffmpeg
console.log('\n    Encoding MP4 with ffmpeg...');
const ffCmd = [
  'ffmpeg', '-y',
  '-framerate', FPS,
  '-i', `"${path.join(FRAMES_DIR, 'frame_%05d.png')}"`,
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  `"${MP4_OUT}"`
].join(' ');

console.log('   ', ffCmd);
execSync(ffCmd, { stdio: 'inherit' });

// Clean up frames
fs.rmSync(FRAMES_DIR, { recursive: true });

const sizeMB = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(1);
console.log(`\n✅  Done!  ${MP4_OUT}  (${sizeMB} MB)`);
