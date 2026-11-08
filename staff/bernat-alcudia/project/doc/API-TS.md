# API TypeScript security and configuration

`api-ts/` requires `MONGO_URL` and `JWT_SECRET` at startup. Use a randomly generated secret with at least 32 bytes; keep it out of source control and rotate it if exposed. `PORT` defaults to `9010`.

The API allows browser origins at `http://localhost:8081`, `http://127.0.0.1:8081` and `http://localhost:19006` for local development. Set `CORS_ORIGINS` to a comma-separated list of exact trusted origins when deploying the app; do not use `*` for production. Deploy behind HTTPS. If a reverse proxy is used, set `TRUST_PROXY` to its exact trusted IPs/CIDRs (comma-separated); never trust arbitrary forwarded headers or all proxies.

The server applies Helmet security headers, exact-origin CORS, a general request limit, stricter per-IP registration and authentication limits, bounded JSON request bodies, and centralized bearer-token verification restricted to HS256. Private endpoints require a valid token; users can retrieve their own profile, while admins can retrieve other profiles. Internal server errors are logged on the server and returned with a generic message.

The API limiter is in-memory and intended for a single process. Use a shared limiter store and appropriate proxy configuration when deploying multiple instances behind a trusted reverse proxy.

## Chats and offers

Authenticated clients can create or reuse a conversation for a product with `POST /chats` (`{ "productId": "..." }`), list conversations with `GET /chats`, and retrieve a thread with `GET /chats/:chatId`. Conversation participants can post messages to `POST /chats/:chatId/messages` (`{ "text": "..." }`).

Participants can propose a positive amount at `POST /chats/:chatId/offers` (`{ "amount": 12.5 }`). The other participant can respond with `PATCH /chats/:chatId/offers/:offerId` and `{ "decision": "accept" }` or `{ "decision": "reject" }`. A user cannot accept their own offer, and another offer cannot be proposed until the pending one is answered.

Once accepted, the buyer can open a Stripe-hosted Checkout session with `POST /chats/:chatId/offers/:offerId/checkout`. The server uses the accepted offer amount in EUR, reserves one unit of stock in a MongoDB transaction, and reuses an existing open Checkout session on retries. Payment is marked complete only after a correctly signed Stripe webhook is received at `POST /payments/webhook`; browser redirects are not proof of payment. Expired and failed checkout webhooks release reserved stock. Configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and an HTTPS `PAYMENT_RETURN_URL` before enabling payments; localhost HTTP return URLs are allowed for development only.

Checkout reservation and webhook fulfillment use MongoDB transactions, so payment deployments must use a replica set (including a single-node replica set for local development). Configure Stripe to send `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, and `checkout.session.async_payment_failed` events to the public webhook URL. Keep Stripe secrets outside source control and use Stripe test keys and a test webhook secret during development.

Checkout charges the configured Stripe account. Seller onboarding, marketplace fee calculation, and payouts via Stripe Connect are not implemented; do not treat a successful Checkout payment as a seller payout.

Run `npm run test:unit` for payment amount and webhook-signature unit tests. `npm run test:integration` starts an isolated temporary replica set and tests profile, social, chat, and payment-webhook behavior; it may download the MongoDB test binary the first time.

## Profiles, follows, and blocks

Authenticated users can edit their own name, email, username, and birth date with `PATCH /users/me/profile`. Role and account ID are not editable. Changing an email address requires the current password. `GET /users/profiles/:targetUserid` returns only public name, username, follow counts, and relationship state.

An optional `photo` field on that PATCH accepts a JPEG or PNG base64 data URL of at most 512,000 characters, or `null` to remove it. Photos are stored in MongoDB and returned in private and public profile responses; clients should not put private information in them. Existing users without a photo receive `null`.

Follow and unfollow with `POST` and `DELETE /users/profiles/:targetUserid/follow`. Block and unblock with `POST` and `DELETE /users/profiles/:targetUserid/block`; `GET /users/me/blocked` lists accounts the current user can unblock. Blocking removes follows in both directions and prevents further profile discovery, chats, messages, offers, and checkout between the pair. Existing products and conversation records are preserved, but blocked conversations are hidden until unblocked.

The mobile conversation view refreshes the thread periodically while open and when pulled down; no WebSocket service is required.
