# 🧪 REA Music — Testing & Quality Assurance Suite

This directory contains automated verification tools and integration smoke tests for the REA Music web application.

---

## 🏃 Running Tests

### 1. Web Application & API Smoke Tests
Validates that the Node.js server starts, serves static assets, renders the Single Page Application, and responds to JioSaavn API proxies (`/api/trending`, `/api/search`).

```bash
npm test
# Or run directly:
node tests/smoke-test.js
```

### 2. Project Architecture & Integrity Verifier
Validates file presence, web directory structure, absence of Android/APK artifacts, and security rules.

```bash
npm run verify
# Or run directly:
node scripts/verify-project.js
```
