# Bonit@ Faller@

## Intro

A social application to share products with title.


In this application, products will be published and then sold until the stock runs out, informing the user that they are out of stock.

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExazZiaTB5NnhsanB0b3I4d29jY2tlZmFqbnprMDEzMWhya2k5a251biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FlqAA0VU1VUaI/giphy.gif)

## Functional Description

### Use cases


- product CRUD (seller)
- view products
- toggle like a product
- toggle save a product (buyer)
- block a user
- follow a user
- edit profile
- search products
- comments (CRUD)
- seller-buyer chat and offers
- hosted payment checkout after an offer is accepted (TypeScript client/API)

The profile, social relationship, and payment flows are implemented in `app-ts/` and `api-ts/`; the JavaScript client/API are separate and do not yet provide these flows.

### UI Design

[figma](https://www.figma.com/design/Q4iQvRbLMlkkjz43Y7gMCo/Bonita-Fallera?node-id=1-3&t=ikXahD24AbVbfBka-1)

## Technical Description

### Technologies

- HTML
- CSS
- JS
- Mongodb
- Express
- Json Web Token
- React Native

### Mobile clients

- `../app/` is the existing Expo client in JavaScript.
- `../app-ts/` is the TypeScript Expo client. Setup, environment configuration and available platform scripts are documented in [APP-TS.md](./APP-TS.md).
- `app/` uses the JavaScript API in `../api/`; `app-ts/` uses the TypeScript API in `../api-ts/`. Their route contracts are separate and must not be mixed.

### Messaging and offers

- Users can start a product-specific conversation with its seller, send messages, and review their conversations in the Messages tab.
- Either participant can propose a price. Only the other participant can accept or reject a pending offer; only one offer can be awaiting a response at a time.
- In the TypeScript flow, an accepted offer allows the buyer to open a EUR Stripe Checkout session. Stock is reserved while checkout is open, and payment is confirmed only from a verified Stripe webhook.
- Blocking a user removes follows in both directions and prevents further profile discovery, chats, messages, offers, and checkout. Existing product listings and conversation history are retained.
- The Stripe Checkout integration charges the configured platform account. Seller payouts and Stripe Connect onboarding are not implemented.

### Data Model

#### User
- id (auto)
- name (string,required)
- birthdate (Date,required)
- username (string,required)
- email (string,required)
- password (string,required)
- role (`regular` | `admin`; new accounts default to `regular`)
- saved (array of Post.id)

#### User relationship
- from (User.id)
- to (User.id)
- kind (`follow` | `block`)
- createdAt / updatedAt (Date)

#### Product
- id (auto)
- user (User.id,required)
- images (string[],required)
- title (string,required)
- description(string)
- brand(string,required)
- price(number,required)
- state(enum used | new, required)
- stock(number,required)
- date (Date)
- likes (array of User.id)

#### Comment
- id (auto)
- product (Product.id,required)
- author (User.id,required)
- text (string,required)
- date (Date)

#### Message
- id (auto)
- from (participant User.id)
- text (string)
- date (Date)

#### Chat
- id (auto)
- product (Product.id)
- participants (two User.id values)
- messages (Message[])
- offers ({ amount, offeredBy, status, date, respondedBy, respondedAt, paymentStatus, checkoutAttemptId, checkoutSessionId, inventoryReserved }[])
- createdAt / updatedAt (Date)
