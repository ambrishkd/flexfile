# FileMorphix 

**A free, unlimited file converter that runs entirely in your browser. No uploads, No limits.**

FileMorphix lets you convert images, audio, and video files between formats without ever sending your files anywhere. Every conversion happens locally on your device using FFmpeg compiled to WebAssembly.

> Built as a personal learning project from scratch to deeply understand Next.js, TypeScript, and browser-based media processing.

## How It Works
 
1. **Drop/Choose a file** — `react-dropzone` accepts images, audio, or video.
2. **Pick a target format** — `getTargetFormats()` reads the file's MIME type and current extension, then shows only valid conversion targets (e.g. a `.jpg` can become PNG, WEBP, GIF, etc., but not itself).
3. **Click Convert** — the `useFFmpeg` hook lazily loads the FFmpeg WebAssembly core (~25MB, cached after first load) directly from a CDN.
4. **FFmpeg runs in your browser** — the file is written into FFmpeg's virtual in-memory filesystem, converted with a single `ffmpeg -i input output` command, then read back out as a `Blob`.
5. **Download** — a `Blob` URL is generated client-side and offered as a direct download. The original file never leaves your device.

## Running Locally
 
```bash
git clone https://github.com/ambrishkd/filemorphix.git
cd filemorphix
npm install
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000)
