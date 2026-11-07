# REA Music — UPI Gateway Setup & Deployment Guide

This integration connects REA Music's Support & Donation experience to a self-hosted instance of [UPI Gateway](https://github.com/mynkdev-21/upi-gateway) (Laravel 12 / PHP 8.2+ / MySQL 8.0+).

The architecture uses an authenticated server-to-server gateway communication model:
- The browser only communicates with REA Music's serverless backend (`/api/donation/*`).
- The payment gateway API credentials (`UPI_GATEWAY_API_KEY` and `UPI_GATEWAY_API_SECRET`) remain strictly server-side and are never delivered to the client.
- Payment success is determined exclusively by the gateway's authoritative server response (`status === "paid"`), never by client redirects, URL parameters, or frontend state.

---

## ⚠️ Important Upstream Security Warning

> **Notice — Development Notice (November 2026)**
>
> The upstream `mynkdev-21/upi-gateway` project contains an active development notice stating that it is undergoing security enhancements, verification reliability fixes, and production-readiness work.
>
> **Production deployment with real-money transactions is not recommended until upstream security reviews and payment verification fixes are completed.**
>
> Therefore:
> 1. Use **Sandbox credentials only** for integration and preview testing.
> 2. Do not enable live donations or real bank accounts until independent security review. Do not accept real contributions through an unreviewed gateway.
> 3. Keep manual UPI transfers (`9509878807@fam`) explicitly labelled as an unverified fallback.

---

## Section A–H: Gateway Deployment Checklist

Deploy and configure the independent Laravel gateway before connecting REA Music:

### A. Gateway Deployment
- Deploy the `mynkdev-21/upi-gateway` application to an isolated, dedicated PHP 8.2+ hosting environment.
- Enforce HTTPS and valid SSL/TLS certificates across all endpoints.

### B. Laravel Configuration
- Run `composer install --no-dev --optimize-autoloader`.
- Run `php artisan key:generate`.
- Set `APP_ENV=production` (or `staging`), `APP_DEBUG=false`, and configure `APP_URL=https://your-gateway-domain.example`.

### C. MySQL Setup
- Provision a dedicated MySQL 8.0+ instance.
- Ensure default character set `utf8mb4` and collation `utf8mb4_unicode_ci`.
- Run database migrations: `php artisan migrate --force`.

### D. Merchant Account Setup
- Log in to the gateway admin panel (`/admin` or initial wizard).
- Create a merchant entity for REA Music.

### E. Payment Account Configuration
- In the merchant panel, add a payment account with the target UPI VPA / QR collection handler.
- Mark the account active and configure daily rotation limits if using multi-account mode.

### F. Verification Provider Configuration
- Link an automated verification provider (e.g., Paytm for Business, PhonePe, or custom automated reconciliation).
- Configure HMAC webhook endpoints if asynchronous notifications are enabled.

### G. Merchant API Credential Generation
- In the Merchant Dashboard under **API Keys**, generate a key/secret pair:
  - `X-Api-Key`: Merchant identifier string.
  - `X-Api-Secret`: High-entropy shared secret.
- **Copy these credentials securely**; store them only in serverless environment configuration.

### H. Redirect Domain Allowlisting
- In Merchant Dashboard → **Settings → Redirect Domains**:
  - Add your REA Music domain(s), e.g.:
    - `https://reamusic.vercel.app` (Production)
    - `https://*-hvsr1984s-projects.vercel.app` (Vercel Preview wildcard)
    - `http://localhost:4500` (Local testing only)
- *Note:* The gateway strictly validates and rejects redirect URLs whose domains are not in this allowlist.

---

## Section I: Vercel Environment Variables

Configure these environment variables in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable | Description | Example / Scope |
|---|---|---|
| `UPI_GATEWAY_URL` | Base URL of deployed Laravel gateway (no trailing slash) | `https://gateway.example.com` |
| `UPI_GATEWAY_API_KEY` | Merchant API key generated in Section G | `mer_test_xxxxxxxx` |
| `UPI_GATEWAY_API_SECRET` | Merchant API secret generated in Section G | `sec_test_yyyyyyyy` |
| `UPI_GATEWAY_RETURN_URL` | Full URL to return user to after gateway checkout | `https://reamusic.vercel.app/donate` |
| `DONATION_RATE_LIMIT_CREATE` | *(Optional)* Maximum order creation requests per IP per minute (default: 30) | `30` |
| `DONATION_RATE_LIMIT_STATUS` | *(Optional)* Maximum status poll checks per IP per minute (default: 60) | `60` |
| `UPI_GATEWAY_TIMEOUT_MS` | *(Optional)* Gateway HTTP timeout in milliseconds (default: 10000) | `10000` |

> **Security Rule:** Never commit real API keys or secrets to Git or place them in client-side code (`js/app.js`, `index.html`, etc.).

---

## Human vs. Automation Responsibility Matrix

| Setting / Step | Where Configured | Responsible Party |
|---|---|---|
| Laravel Database & Admin Wizard | Gateway Server / cPanel / VPS | Human Admin / DevOps |
| Merchant Creation & Verification Provider | Gateway Merchant Dashboard | Human Merchant Owner |
| Allowlisting REA Music Redirect Domains | Gateway Merchant Settings | Human Merchant Owner |
| Generating API Key & Secret | Gateway Merchant API Keys | Human Merchant Owner |
| Setting Vercel Environment Variables | Vercel Project Settings | DevOps / Project Admin |
| Triggering New Vercel Deployment | Vercel Dashboard / Git Push | DevOps / Automatic |
| Verification Test Execution | REA Music Local / CI Terminal | QA / Automated Suite |

---

## Section J: Local Sandbox Testing

To test the integration locally without touching production:

1. Clone or pull the `payment/upi-gateway-integration` branch.
2. In the REA Music root directory, ensure `.env` contains local or sandbox credentials:
   ```bash
   UPI_GATEWAY_URL=https://sandbox.your-gateway.example
   UPI_GATEWAY_API_KEY=test_key_xxxx
   UPI_GATEWAY_API_SECRET=test_secret_yyyy
   UPI_GATEWAY_RETURN_URL=http://localhost:4500/donate
   ```
3. Start the local server:
   ```bash
   npm start
   ```
4. Open [http://localhost:4500/donate](http://localhost:4500/donate) in your browser.
5. Select an amount (e.g., ₹51) and click **Pay with UPI**.
6. Verify you are redirected to the sandbox payment page.
7. Complete or simulate a payment and observe redirect back to `/donate?order_id=...`.
8. Check that REA Music polls status and displays the verified success screen.
9. Run the automated integration mock tests:
   ```bash
   npm run test:upi-gateway
   ```

---

## Section K: Vercel Preview Testing

1. Open a Pull Request from `payment/upi-gateway-integration` to `main`.
2. Vercel will automatically generate a Preview deployment URL (e.g., `https://rea-music-git-payment-...vercel.app`).
3. Ensure the gateway allowlist in Section H includes your preview domain or wildcard pattern.
4. Add the sandbox `UPI_GATEWAY_*` variables under Vercel Project Settings scoped specifically to the **Preview** environment.
5. Trigger a rebuild of the preview branch so environment variables take effect.
6. Open the preview deployment at `/donate` on desktop and mobile browsers to verify the checkout redirect, service worker cache bypass, and status polling.

---

## Section L: Production Limitations, Rate Limiting & Rollback

### Architecture & Rate Limiting Note
- On Vercel Serverless, instances are ephemeral. In-memory maps (`DONATION_RATE_LIMITS`, `RECENT_DONATION_ORDERS`) protect against rapid burst concurrency on individual lambdas and local instances, but do not share state across distributed global nodes.
- **Production Recommendation**: When launching high-volume production donations, connect a persistent distributed key-value store (e.g. Upstash Redis or Vercel KV) or configure Vercel Web Application Firewall (WAF) rate-limiting rules.

### Rollback Procedure
If the gateway experiences downtime or issues:
1. Navigate to **Vercel Dashboard → Project Settings → Environment Variables**.
2. Remove or unset the `UPI_GATEWAY_*` variables.
3. Redeploy the application.
4. When `UPI_GATEWAY_URL` is absent, the backend returns HTTP 503 ("Donation checkout is not configured yet"), and the frontend guides users to the unverified manual UPI QR transfer fallback (`9509878807@fam`).
