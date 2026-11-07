/**
 * tests/test-upi-gateway-integration.mjs
 *
 * Comprehensive Automated Acceptance & Security Suite for UPI Gateway Integration:
 *
 * 1. Successful order creation.
 * 2. Invalid amount rejection.
 * 3. Zero amount rejection.
 * 4. Negative amount rejection.
 * 5. More than two decimal places.
 * 6. Amount above maximum (> 1,00,000).
 * 7. Gateway timeout handling.
 * 8. Gateway authentication failure.
 * 9. Gateway unavailable / bad gateway handling.
 * 10. Missing environment variables rejection (503).
 * 11. Duplicate order protection (rapid duplicate suppression).
 * 12. Payment pending status retrieval.
 * 13. Payment successful status verification (paid).
 * 14. Payment expired status handling.
 * 15. Payment under review status handling.
 * 16. Invalid order reference rejection (400).
 * 17. Cross-origin request rejection (403 without open CORS).
 * 18. Status response caching prevention (no-store, no-cache).
 * 19. Frontend success state only after gateway verification.
 * 20. No secret credentials in frontend bundle.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.VERCEL = '1';

const { default: apiHandler } = await import('../api/index.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passed += 1;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed += 1;
  }
}

// ---------------------------------------------------------------------------
// Mock UPI Gateway Server
// ---------------------------------------------------------------------------
const MOCK_API_KEY = 'test_merchant_api_key_valid';
const MOCK_API_SECRET = 'test_merchant_api_secret_valid';

let mockGatewayOrders = new Map();
let mockGatewayDelayMs = 0;
let mockGatewayForceError = null;

const mockGatewayServer = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (mockGatewayDelayMs > 0) {
    await new Promise((r) => setTimeout(r, mockGatewayDelayMs));
  }

  if (mockGatewayForceError) {
    res.writeHead(mockGatewayForceError.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockGatewayForceError.body));
    return;
  }

  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (apiKey !== MOCK_API_KEY || apiSecret !== MOCK_API_SECRET) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Unauthenticated merchant credentials.' }));
    return;
  }

  // Create Order
  if (req.method === 'POST' && pathname === '/api/v1/orders') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        const body = JSON.parse(raw);
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const orderData = {
          order_id: orderId,
          client_order_id: body.client_order_id,
          amount: body.amount,
          status: 'pending',
          payment_url: `http://${req.headers.host}/pay/${orderId}`,
          expires_at: new Date(Date.now() + 900000).toISOString()
        };
        mockGatewayOrders.set(orderId, orderData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: orderData }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
      }
    });
    return;
  }

  // Check Order Status
  if (req.method === 'GET' && pathname.startsWith('/api/v1/orders/')) {
    const orderId = decodeURIComponent(pathname.slice('/api/v1/orders/'.length));
    const order = mockGatewayOrders.get(orderId);
    if (!order) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Order reference not found' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: order }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Endpoint not found' }));
});

// ---------------------------------------------------------------------------
// Start Servers
// ---------------------------------------------------------------------------
await new Promise(r => mockGatewayServer.listen(0, '127.0.0.1', r));
const gatewayPort = mockGatewayServer.address().port;
const gatewayBaseUrl = `http://127.0.0.1:${gatewayPort}`;

// Configure REA Music environment variables
process.env.UPI_GATEWAY_URL = gatewayBaseUrl;
process.env.UPI_GATEWAY_API_KEY = MOCK_API_KEY;
process.env.UPI_GATEWAY_API_SECRET = MOCK_API_SECRET;
process.env.UPI_GATEWAY_RETURN_URL = 'http://127.0.0.1:4500/donate';
process.env.UPI_GATEWAY_TIMEOUT_MS = '10000';

const reaServer = http.createServer(apiHandler);
await new Promise(r => reaServer.listen(0, '127.0.0.1', r));
const reaPort = reaServer.address().port;
const reaBaseUrl = `http://127.0.0.1:${reaPort}`;

console.log(`\n🧪 [UPI Gateway Test Suite] Running 20 comprehensive acceptance checks...\n`);

try {
  // -------------------------------------------------------------------------
  // 1. Successful order creation
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 101 })
    });
    const body = await res.json();
    assert(
      res.status === 201 &&
      body.success === true &&
      body.orderId &&
      body.orderId.startsWith('ORD-') &&
      body.clientOrderId &&
      body.clientOrderId.startsWith('REA-') &&
      body.paymentUrl &&
      body.paymentUrl.includes('/pay/'),
      'Test 1: Successful order creation returns 201 with orderId and paymentUrl'
    );
  }

  // -------------------------------------------------------------------------
  // 2. Invalid amount rejection
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 'invalid-string' })
    });
    const body = await res.json();
    assert(res.status === 422 && body.error, 'Test 2: Non-numeric amount is rejected with 422');
  }

  // -------------------------------------------------------------------------
  // 3. Zero amount rejection
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 0 })
    });
    const body = await res.json();
    assert(res.status === 422 && body.error, 'Test 3: Zero amount is rejected with 422');
  }

  // -------------------------------------------------------------------------
  // 4. Negative amount rejection
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: -50 })
    });
    const body = await res.json();
    assert(res.status === 422 && body.error, 'Test 4: Negative amount is rejected with 422');
  }

  // -------------------------------------------------------------------------
  // 5. More than two decimal places rejection
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: '101.999' })
    });
    const body = await res.json();
    assert(res.status === 422 && body.error, 'Test 5: Amounts with > 2 decimal places are rejected with 422');
  }

  // -------------------------------------------------------------------------
  // 6. Amount above maximum rejection (> 1,00,000)
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 150000 })
    });
    const body = await res.json();
    assert(res.status === 422 && body.error, 'Test 6: Amount exceeding ₹1,00,000 is rejected with 422');
  }

  // -------------------------------------------------------------------------
  // 7. Gateway timeout
  // -------------------------------------------------------------------------
  {
    process.env.UPI_GATEWAY_TIMEOUT_MS = '200';
    mockGatewayDelayMs = 500;
    try {
      const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 29 })
      });
      assert(res.status === 504 || res.status === 502, 'Test 7: Gateway timeout returns 504 Gateway Timeout or 502');
    } finally {
      mockGatewayDelayMs = 0;
      process.env.UPI_GATEWAY_TIMEOUT_MS = '10000';
    }
  }

  // -------------------------------------------------------------------------
  // 8. Gateway authentication failure
  // -------------------------------------------------------------------------
  {
    const originalKey = process.env.UPI_GATEWAY_API_KEY;
    process.env.UPI_GATEWAY_API_KEY = 'invalid_tampered_key';
    try {
      const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 51 })
      });
      const body = await res.json();
      assert(
        res.status === 502 &&
        body.error &&
        !JSON.stringify(body).includes(MOCK_API_SECRET),
        'Test 8: Gateway authentication failure returns 502 without leaking secrets'
      );
    } finally {
      process.env.UPI_GATEWAY_API_KEY = originalKey;
    }
  }

  // -------------------------------------------------------------------------
  // 9. Gateway unavailable
  // -------------------------------------------------------------------------
  {
    const originalUrl = process.env.UPI_GATEWAY_URL;
    process.env.UPI_GATEWAY_URL = 'http://127.0.0.1:1'; // unreachable port
    try {
      const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 75 })
      });
      assert(res.status === 502, 'Test 9: Gateway connection error returns 502 Bad Gateway');
    } finally {
      process.env.UPI_GATEWAY_URL = originalUrl;
    }
  }

  // -------------------------------------------------------------------------
  // 10. Missing environment variables
  // -------------------------------------------------------------------------
  {
    const originalKey = process.env.UPI_GATEWAY_API_KEY;
    delete process.env.UPI_GATEWAY_API_KEY;
    try {
      const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 51 })
      });
      const body = await res.json();
      assert(res.status === 503 && body.error.includes('not configured'), 'Test 10: Missing environment variable returns 503 Service Unavailable');
    } finally {
      process.env.UPI_GATEWAY_API_KEY = originalKey;
    }
  }

  // -------------------------------------------------------------------------
  // 11. Duplicate order protection
  // -------------------------------------------------------------------------
  {
    // First creation for ₹251
    const res1 = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 251 })
    });
    // Immediate second creation for same amount from same IP
    const res2 = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 251 })
    });
    assert(
      res1.status === 201 && res2.status === 429,
      'Test 11: Duplicate order attempt within debounce window is suppressed with 429'
    );
  }

  // -------------------------------------------------------------------------
  // 12. Payment pending status
  // -------------------------------------------------------------------------
  {
    const orderId = 'ORD-STATUS-PENDING-1';
    mockGatewayOrders.set(orderId, {
      order_id: orderId,
      client_order_id: 'REA-TEST-PENDING',
      amount: '51.00',
      status: 'pending',
      expires_at: new Date(Date.now() + 900000).toISOString()
    });
    const res = await fetch(`${reaBaseUrl}/api/donation/status/${orderId}`);
    const body = await res.json();
    assert(res.status === 200 && body.success === true && body.status === 'pending', 'Test 12: Status endpoint returns pending payment state');
  }

  // -------------------------------------------------------------------------
  // 13. Payment successful status (paid)
  // -------------------------------------------------------------------------
  {
    const orderId = 'ORD-STATUS-PAID-1';
    const paidAt = new Date().toISOString();
    mockGatewayOrders.set(orderId, {
      order_id: orderId,
      client_order_id: 'REA-TEST-PAID',
      amount: '101.00',
      status: 'paid',
      paid_at: paidAt,
      expires_at: new Date(Date.now() + 900000).toISOString()
    });
    const res = await fetch(`${reaBaseUrl}/api/donation/status/${orderId}`);
    const body = await res.json();
    assert(
      res.status === 200 &&
      body.success === true &&
      body.status === 'paid' &&
      body.paidAt === paidAt,
      'Test 13: Status endpoint verifies paid payment state with timestamp'
    );
  }

  // -------------------------------------------------------------------------
  // 14. Payment expired status
  // -------------------------------------------------------------------------
  {
    const orderId = 'ORD-STATUS-EXPIRED-1';
    mockGatewayOrders.set(orderId, {
      order_id: orderId,
      client_order_id: 'REA-TEST-EXPIRED',
      amount: '51.00',
      status: 'expired',
      expires_at: new Date(Date.now() - 3600000).toISOString()
    });
    const res = await fetch(`${reaBaseUrl}/api/donation/status/${orderId}`);
    const body = await res.json();
    assert(res.status === 200 && body.success === true && body.status === 'expired', 'Test 14: Status endpoint returns expired payment state');
  }

  // -------------------------------------------------------------------------
  // 15. Payment under review status
  // -------------------------------------------------------------------------
  {
    const orderId = 'ORD-STATUS-REVIEW-1';
    mockGatewayOrders.set(orderId, {
      order_id: orderId,
      client_order_id: 'REA-TEST-REVIEW',
      amount: '251.00',
      status: 'under_review',
      expires_at: new Date(Date.now() + 900000).toISOString()
    });
    const res = await fetch(`${reaBaseUrl}/api/donation/status/${orderId}`);
    const body = await res.json();
    assert(res.status === 200 && body.success === true && body.status === 'under_review', 'Test 15: Status endpoint returns under_review payment state');
  }

  // -------------------------------------------------------------------------
  // 16. Invalid order reference rejection
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/status/bad@order#reference!`);
    const body = await res.json();
    assert(res.status === 400 && body.error, 'Test 16: Malformed order reference is rejected with 400');
  }

  // -------------------------------------------------------------------------
  // 17. Cross-origin request rejection
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://malicious-attacker-domain.example'
      },
      body: JSON.stringify({ amount: 51 })
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(
      res.status === 403 &&
      allowOrigin !== '*' &&
      allowOrigin !== 'https://malicious-attacker-domain.example',
      'Test 17: Cross-origin donation creation is rejected with 403 and restricted CORS'
    );
  }

  // -------------------------------------------------------------------------
  // 18. Status response caching prevention
  // -------------------------------------------------------------------------
  {
    const res = await fetch(`${reaBaseUrl}/api/donation/status/ORD-STATUS-PAID-1`);
    const cacheControl = res.headers.get('cache-control') || '';
    const pragma = res.headers.get('pragma') || '';
    assert(
      cacheControl.includes('no-store') &&
      cacheControl.includes('no-cache') &&
      pragma.includes('no-cache'),
      'Test 18: Payment status API response is explicitly excluded from shared/public caching'
    );
  }

  // -------------------------------------------------------------------------
  // 19. Frontend success state requires gateway verification
  // -------------------------------------------------------------------------
  {
    const appJs = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

    const requiresAuthoritativePaid = appJs.includes("status === 'paid'") &&
      appJs.includes('/api/donation/status/') &&
      appJs.includes('this.verifyDonationPayment');

    const acknowledgeButtonGuarded = !appJs.includes("this.donationThankYouBox.classList.toggle('hidden')");

    const exactMessagePresent = indexHtml.includes('Thank you for supporting REA Music! Your contribution has been successfully verified. Your support helps us keep the music experience alive.') ||
      appJs.includes('Thank you for supporting REA Music! Your contribution has been successfully verified. Your support helps us keep the music experience alive.');

    assert(
      requiresAuthoritativePaid && acknowledgeButtonGuarded && exactMessagePresent,
      'Test 19: Frontend renders verified success screen only after authoritative gateway verification'
    );
  }

  // -------------------------------------------------------------------------
  // 20. No secret credentials in frontend bundle
  // -------------------------------------------------------------------------
  {
    const appJs = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const distHtml = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
    const distApp = fs.readFileSync(path.join(root, 'dist', 'js', 'app.js'), 'utf8');

    const noSecretInSrc = !appJs.includes('UPI_GATEWAY_API_KEY') && !appJs.includes('UPI_GATEWAY_API_SECRET');
    const noSecretInIndex = !indexHtml.includes('UPI_GATEWAY_API_KEY') && !indexHtml.includes('UPI_GATEWAY_API_SECRET');
    const noSecretInDistHtml = !distHtml.includes('UPI_GATEWAY_API_KEY') && !distHtml.includes('UPI_GATEWAY_API_SECRET');
    const noSecretInDistApp = !distApp.includes('UPI_GATEWAY_API_KEY') && !distApp.includes('UPI_GATEWAY_API_SECRET');

    assert(
      noSecretInSrc && noSecretInIndex && noSecretInDistHtml && noSecretInDistApp,
      'Test 20: No merchant API keys or secrets are exposed in client-facing source or built bundles'
    );
  }

  // -------------------------------------------------------------------------
  // Static Configuration & Deployment Safety Regression Assertions
  // -------------------------------------------------------------------------
  {
    const api = fs.readFileSync(path.join(root, 'api', 'index.js'), 'utf8');
    const app = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
    const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
    const docs = fs.readFileSync(path.join(root, 'docs', 'UPI_GATEWAY_SETUP.md'), 'utf8');

    assert(api.includes("pathname === '/api/donation/create'") && api.includes("pathParam === 'donation/create'"), 'server exposes donation order creation endpoint');
    assert(api.includes("/api/donation/status/") && api.includes('payload.data.status'), 'server exposes authenticated donation status verification');
    assert(api.includes('UPI_GATEWAY_API_KEY') && api.includes('UPI_GATEWAY_API_SECRET'), 'gateway credentials are read only from server environment');
    assert(api.includes("'X-Api-Key': apiKey") && api.includes("'X-Api-Secret': apiSecret"), 'gateway credentials are sent only in server-to-server headers');
    assert(api.includes('crypto.randomBytes(5)') && api.includes('client_order_id'), 'every contribution receives a unique gateway order reference');
    assert(app.includes("fetch('/api/donation/create'") && app.includes('window.location.assign(result.paymentUrl)'), 'Support page starts and redirects to hosted gateway checkout');
    assert(app.includes('handleDonationReturn()') && (app.includes("params.get('order_id')") || app.includes("params.get('orderId')")), 'Support page handles the gateway return URL');
    assert(env.includes('UPI_GATEWAY_URL=') && env.includes('UPI_GATEWAY_API_KEY=') && env.includes('UPI_GATEWAY_API_SECRET=') && env.includes('UPI_GATEWAY_RETURN_URL='), 'environment template documents required gateway settings');
    assert(docs.includes('Do not accept real contributions through an unreviewed gateway.'), 'deployment guide warns against live payments before upstream security review');
  }

} finally {
  reaServer.close();
  mockGatewayServer.close();
}

console.log(`\n=======================================`);
console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  console.error(`❌ UPI Gateway integration tests failed with ${failed} failure(s)!`);
  process.exit(1);
} else {
  console.log(`🎉 All 20 UPI Gateway Integration Acceptance Tests Passed Successfully!`);
  process.exit(0);
}
