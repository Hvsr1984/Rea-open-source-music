#!/usr/bin/env node
/**
 * scripts/verify-project.js
 * Comprehensive automated project structure, integrity, and safety verifier for REA Music (Web-Only).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let errors = 0;
let warnings = 0;

function check(label, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      console.log(`  ✅ ${label}`);
    } else {
      console.log(`  ❌ ${label}: ${result}`);
      errors++;
    }
  } catch (err) {
    console.log(`  ❌ ${label}: ${err.message}`);
    errors++;
  }
}

console.log('🔍 [REA Verification] Starting Web-Only Project Integrity Audit...\n');

// 1. Root Web Files
console.log('1. Framework-Required Web Files:');
const requiredRootFiles = [
  'package.json',
  'index.html',
  'server.js',
  'build.js',
  'vercel.json',
  '.gitignore',
  'README.md'
];
requiredRootFiles.forEach(file => {
  check(`Root file exists: ${file}`, () => {
    if (!fs.existsSync(path.join(rootDir, file))) return 'Missing';
  });
});

// 2. Verified Absence of Android & APK Components
console.log('\n2. Complete Absence of Android & APK Components:');
const forbiddenPaths = [
  'android',
  'releases',
  'capacitor.config.json',
  'apps/android',
  'scripts/build-android.bat',
  'scripts/locate-apks.js',
  'docs/ANDROID_GUIDE.md'
];
forbiddenPaths.forEach(f => {
  check(`Confirmed removed: ${f}`, () => {
    if (fs.existsSync(path.join(rootDir, f))) return 'Still present!';
  });
});

// Check for any rogue .apk or .aab files
check('Zero .apk or .aab binary files in workspace', () => {
  function scan(dir) {
    let found = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        found = found.concat(scan(full));
      } else if (entry.name.endsWith('.apk') || entry.name.endsWith('.aab')) {
        found.push(full);
      }
    }
    return found;
  }
  const apks = scan(rootDir);
  if (apks.length > 0) return `Found unexpected binaries: ${apks.join(', ')}`;
});

// 3. Web Directory Structure
console.log('\n3. Web-Only Directory Architecture:');
const requiredDirectories = [
  'api',
  'assets/branding',
  'assets/icons',
  'assets/images',
  'assets/screenshots',
  'css',
  'docs',
  'js',
  'public',
  'dist',
  'scripts',
  'tests',
  'config',
  'archive'
];
requiredDirectories.forEach(dir => {
  check(`Directory exists: ${dir}`, () => {
    if (!fs.existsSync(path.join(rootDir, dir))) return 'Missing';
    if (!fs.statSync(path.join(rootDir, dir)).isDirectory()) return 'Not a directory';
  });
});

// 4. Web Documentation Suite
console.log('\n4. Web Documentation Suite:');
const requiredDocs = [
  'docs/PROJECT_STRUCTURE.md',
  'docs/BUILD_GUIDE.md',
  'docs/DEPLOYMENT.md',
  'docs/CHANGELOG.md',
  'tests/README.md',
  'config/README.md',
  'archive/README.md'
];
requiredDocs.forEach(doc => {
  check(`Documentation file: ${doc}`, () => {
    const full = path.join(rootDir, doc);
    if (!fs.existsSync(full)) return 'Missing';
    const stat = fs.statSync(full);
    if (stat.size < 50) return 'File too small (incomplete)';
  });
});

// 5. Security & Configuration Protection
console.log('\n5. Security & Configuration Protection:');
check('config/.env.example exists with placeholder values', () => {
  const envEx = path.join(rootDir, 'config/.env.example');
  if (!fs.existsSync(envEx)) return 'Missing';
  const content = fs.readFileSync(envEx, 'utf8');
  if (!content.includes('VERCEL_OIDC_TOKEN') || !content.includes('PORT')) {
    return 'Missing required placeholder variables';
  }
});

check('.gitignore excludes sensitive environment files', () => {
  const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
  if (!gitignore.includes('.env')) return '.env not ignored';
});

// Summary
console.log('\n=======================================');
if (errors === 0) {
  console.log(`🎉 Web Project Verification Passed! (${warnings} warning(s))`);
  process.exit(0);
} else {
  console.error(`❌ Project Verification Failed with ${errors} error(s)!`);
  process.exit(1);
}
