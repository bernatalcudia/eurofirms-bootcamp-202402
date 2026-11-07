# API TypeScript security and configuration

`api-ts/` requires `MONGO_URL` and `JWT_SECRET` at startup. Use a randomly generated secret with at least 32 bytes; keep it out of source control and rotate it if exposed. `PORT` defaults to `9010`.

The API allows browser origins at `http://localhost:8081`, `http://127.0.0.1:8081` and `http://localhost:19006` for local development. Set `CORS_ORIGINS` to a comma-separated list of exact trusted origins when deploying the app; do not use `*` for production. Deploy behind HTTPS. If a reverse proxy is used, set `TRUST_PROXY` to its exact trusted IPs/CIDRs (comma-separated); never trust arbitrary forwarded headers or all proxies.

The server applies Helmet security headers, exact-origin CORS, a general request limit, stricter per-IP registration and authentication limits, bounded JSON request bodies, and centralized bearer-token verification restricted to HS256. Private endpoints require a valid token; users can retrieve their own profile, while admins can retrieve other profiles. Internal server errors are logged on the server and returned with a generic message.

The API limiter is in-memory and intended for a single process. Use a shared limiter store and appropriate proxy configuration when deploying multiple instances behind a trusted reverse proxy.

## Chats and offers

Authenticated clients can create or reuse a conversation for a product with `POST /chats` (`{ "productId": "..." }`), list conversations with `GET /chats`, and retrieve a thread with `GET /chats/:chatId`. Conversation participants can post messages to `POST /chats/:chatId/messages` (`{ "text": "..." }`).

Participants can propose a positive amount at `POST /chats/:chatId/offers` (`{ "amount": 12.5 }`). The other participant can respond with `PATCH /chats/:chatId/offers/:offerId` and `{ "decision": "accept" }` or `{ "decision": "reject" }`. A user cannot accept their own offer, and another offer cannot be proposed until the pending one is answered. An accepted offer represents mutual agreement only: payments, sale completion, and stock updates are intentionally outside this feature.

The mobile conversation view refreshes the thread periodically while open and when pulled down; no WebSocket service is required.
