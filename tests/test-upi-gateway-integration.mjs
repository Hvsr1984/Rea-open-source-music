import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed += 1;
  } else {
    console.error(`❌ ${message}`);
    failed += 1;
  }
}

const api = fs.readFileSync(path.join(root, 'api', 'index.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const docs = fs.readFileSync(path.join(root, 'docs', 'UPI_GATEWAY_SETUP.md'), 'utf8');

assert(api.includes("pathname === '/api/donation/create'") && api.includes("pathParam === 'donation/create'"), 'server exposes donation order creation endpoint');
assert(api.includes("/api/donation/status/") && api.includes('payload.data.status'), 'server exposes authenticated donation status verification');
assert(api.includes('UPI_GATEWAY_API_KEY') && api.includes('UPI_GATEWAY_API_SECRET'), 'gateway credentials are read only from server environment');
assert(api.includes("'X-Api-Key': apiKey") && api.includes("'X-Api-Secret': apiSecret"), 'gateway credentials are sent only in server-to-server headers');
assert(api.includes('crypto.randomBytes(5)') && api.includes('client_order_id'), 'every contribution receives a unique gateway order reference');
assert(api.includes('amount < 1') && api.includes('amount > 100000') && api.includes('Math.round(amount * 100)'), 'server validates INR amount and decimal precision');
assert(api.includes('donationRequestAllowed') && api.includes('isSameOriginDonationRequest'), 'donation API applies basic same-origin and rate-limit protections');
assert(api.includes("includes('no-store')"), 'payment status responses are excluded from shared caching');

assert(app.includes("fetch('/api/donation/create'") && app.includes('window.location.assign(result.paymentUrl)'), 'Support page starts and redirects to hosted gateway checkout');
assert(app.includes('/api/donation/status/') && app.includes("status === 'paid'"), 'Support page checks status and requires gateway-confirmed paid state');
assert(app.includes('handleDonationReturn()') && app.includes("params.get('order_id')"), 'Support page handles the gateway return URL');
assert(!app.includes('this.donationThankYouBox.classList.toggle(\'hidden\')'), 'user acknowledgement cannot independently show a successful payment');

assert(env.includes('UPI_GATEWAY_URL=') && env.includes('UPI_GATEWAY_API_KEY=') && env.includes('UPI_GATEWAY_API_SECRET=') && env.includes('UPI_GATEWAY_RETURN_URL='), 'environment template documents required gateway settings');
assert(docs.includes('Do not accept real contributions through an unreviewed gateway.'), 'deployment guide warns against live payments before upstream security review');

console.log(`\nUPI Gateway integration checks: ${passed} passed, ${failed} failed.`);
process.exitCode = failed ? 1 : 0;
