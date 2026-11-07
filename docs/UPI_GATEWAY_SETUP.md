# REA Music — UPI Gateway Setup

This integration keeps the existing REA Music donation page and creates payment orders through the self-hosted UPI Gateway. The browser calls REA Music's own API; the gateway API key and secret remain server-side.

## Important deployment warning

The upstream `mynkdev-21/upi-gateway` README (checked 7 November 2026) says the project is undergoing security, verification, and production-readiness work and explicitly advises against production deployment until those fixes and reviews are complete. Keep this integration on a test deployment and use sandbox credentials until the upstream project is independently reviewed and declared ready. Do not accept real contributions through an unreviewed gateway.

## Gateway Deployment Checklist

Follow these steps to deploy and configure the separate Laravel 12 gateway:

1. **Deploy Laravel Gateway on HTTPS Hosting**: Deploy to an isolated PHP 8.2+ hosting environment with SSL/TLS enforced.
2. **Complete Installation Wizard**: Run through the Laravel web installation wizard to initialize application keys and environment.
3. **Configure MySQL**: Set up a dedicated MySQL 8.0+ database with strict utf8mb4 collation and configure database credentials in `.env`.
4. **Create Initial Administrator**: Generate the primary administrative user through the wizard or `php artisan make:admin`.
5. **Configure Merchant Account**: Create or register the merchant entity corresponding to REA Music.
6. **Add & Activate Payment Account**: Link a valid UPI payment account (VPA / QR collection handler) and mark it active.
7. **Configure Payment Verification Provider**: Set up the automated payment reconciliation provider or banking webhook.
8. **Generate Merchant API Credentials**: In the merchant dashboard, generate the `X-Api-Key` and `X-Api-Secret` pair.
9. **Configure Redirect Domains**: In **Settings → Redirect Domains**, whitelist the REA Music domain (e.g., `https://reamusic.vercel.app` or `http://localhost:4500`). The gateway rejects unapproved redirect domains.
10. **Use Sandbox Credentials for Integration Testing**: Always test end-to-end payment creation and verification in sandbox mode before considering any production use.

## Required gateway setup

1. Deploy the gateway only to an HTTPS host after reviewing its current release and security guidance.
2. Complete its installation wizard and configure an active merchant account and UPI/payment account.
3. In the gateway merchant dashboard, create or copy the merchant API key and API secret. Use the test key/secret pair for sandbox testing.
4. In the merchant dashboard's **Settings → Redirect Domains**, allow the REA Music host (for example, `reamusic.vercel.app`). The gateway validates redirect domains before accepting `redirect_url`.
5. Confirm the gateway API is reachable at `https://your-gateway-domain.example/api/v1/orders`.

## Vercel environment variables

Add these variables to the REA Music Vercel project. Do not place real credentials in source files, browser JavaScript, or GitHub.

| Variable | Value |
|---|---|
| `UPI_GATEWAY_URL` | Gateway base URL without a trailing slash |
| `UPI_GATEWAY_API_KEY` | Merchant API key (test key for sandbox) |
| `UPI_GATEWAY_API_SECRET` | Merchant API secret |
| `UPI_GATEWAY_RETURN_URL` | `https://reamusic.vercel.app/donate` (use your real production host after review) |

Redeploy after adding or changing environment variables.

## Payment flow

1. The Support page validates the amount and sends it to `POST /api/donation/create`.
2. REA Music's serverless function validates the amount, creates a unique order reference, and sends the order to `POST /api/v1/orders` using server-side credentials.
3. The gateway returns a hosted `payment_url`; the browser is redirected there.
4. After the gateway verifies the payment, it redirects to the configured REA Music URL. The gateway appends the order reference and status.
5. REA Music then calls `GET /api/donation/status/{orderId}`; the server checks the order through the gateway's authenticated order-status API.
6. The Support page shows a success message only when the gateway returns `paid`. A browser acknowledgement alone is never treated as payment proof.

## API endpoints added to REA Music

- `POST /api/donation/create` — validates and creates a gateway order.
- `GET /api/donation/status/{orderId}` — checks the order status server-to-server.

The donation endpoints reject cross-origin browser requests, apply basic per-IP rate limits, validate the amount, disable caching for payment status, and never return merchant API credentials. The gateway also enforces its own merchant API authentication and rate limits.

## Test checklist

- Use gateway sandbox API credentials first.
- Confirm the configured redirect domain includes the exact REA Music host.
- Test invalid amounts (zero, negative, over ₹1,00,000, and more than two decimals).
- Test pending, paid, expired, and failed status responses.
- Confirm only a server-verified `paid` status reveals the success message.
- Confirm API key and secret are absent from the browser's Network payloads, page source, and built assets.
- Run `npm run test:donation`, `npm run test:upi-gateway`, `npm test`, and `npm run verify`.

## Rollback

Remove the four `UPI_GATEWAY_*` environment variables from Vercel and redeploy. The API endpoints will return a not-configured response. The static QR/UPI details remain visible for manual support; do not manually mark such payments as gateway-verified.
