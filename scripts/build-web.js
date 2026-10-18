#!/usr/bin/env node
/**
 * scripts/build-web.js
 * Safe execution wrapper for REA Music web application build.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🎵 [REA Build Tool] Starting production web bundle...');

try {
  // Execute main build script
  execSync('node build.js', { cwd: rootDir, stdio: 'inherit' });

  // Verify critical output files
  const distHtml = path.join(rootDir, 'dist', 'index.html');
  const publicHtml = path.join(rootDir, 'public', 'index.html');

  if (!fs.existsSync(distHtml) || !fs.existsSync(publicHtml)) {
    throw new Error('Build artifact verification failed: dist/index.html or public/index.html missing!');
  }

  const distStat = fs.statSync(distHtml);
  console.log(`✅ [REA Build Tool] Web bundle successfully verified!`);
  console.log(`📦 dist/index.html: ${(distStat.size / 1024).toFixed(1)} KB`);
  process.exit(0);
} catch (error) {
  console.error('❌ [REA Build Tool] Build execution error:', error.message);
  process.exit(1);
}
