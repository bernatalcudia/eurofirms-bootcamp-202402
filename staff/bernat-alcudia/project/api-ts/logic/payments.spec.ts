import { expect } from "chai"
import Stripe from "stripe"
import { errors } from "com"
import { handleStripeWebhook, toStripeAmount } from "./payments"

describe("Stripe payment helpers", () => {
    it("converts EUR amounts to integer cents", () => {
        expect(toStripeAmount(12.34)).to.equal(1234)
        expect(toStripeAmount(0.01)).to.equal(1)
    })

    it("rejects amounts that cannot be represented safely in cents", () => {
        expect(() => toStripeAmount(0)).to.throw(errors.ValidationError)
        expect(() => toStripeAmount(0.001)).to.throw(errors.ValidationError)
        expect(() => toStripeAmount(Number.POSITIVE_INFINITY)).to.throw(errors.ValidationError)
        expect(() => toStripeAmount(1_000_000)).to.throw(errors.ValidationError)
    })

    it("accepts a correctly signed event without processing unrelated Stripe events", async () => {
        const previousSecret = process.env.STRIPE_SECRET_KEY
        const previousWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        process.env.STRIPE_SECRET_KEY = "sk_test_unit_test_key"
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_dW5pdF90ZXN0X3NlY3JldA=="
        const event = {
            id: "evt_test",
            object: "event",
            api_version: "2024-06-20",
            created: Math.floor(Date.now() / 1000),
            data: { object: { id: "cus_test", object: "customer" } },
            livemode: false,
            pending_webhooks: 1,
            type: "customer.created",
        }
        const rawBody = Buffer.from(JSON.stringify(event))
        const signedHeader = Stripe.webhooks.generateTestHeaderString({
            payload: rawBody.toString("utf8"),
            secret: "whsec_dW5pdF90ZXN0X3NlY3JldA==",
        })

        try {
            await handleStripeWebhook(rawBody, signedHeader)
        } finally {
            if (previousSecret === undefined) delete process.env.STRIPE_SECRET_KEY
            else process.env.STRIPE_SECRET_KEY = previousSecret
            if (previousWebhookSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET
            else process.env.STRIPE_WEBHOOK_SECRET = previousWebhookSecret
        }
    })

    it("rejects a webhook with an invalid signature", async () => {
        const previousSecret = process.env.STRIPE_SECRET_KEY
        const previousWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        process.env.STRIPE_SECRET_KEY = "sk_test_unit_test_key"
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_dW5pdF90ZXN0X3NlY3JldA=="
        let error: unknown
        try {
            await handleStripeWebhook(Buffer.from("{}"), "t=1,v1=invalid")
        } catch (caught) {
            error = caught
        } finally {
            if (previousSecret === undefined) delete process.env.STRIPE_SECRET_KEY
            else process.env.STRIPE_SECRET_KEY = previousSecret
            if (previousWebhookSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET
            else process.env.STRIPE_WEBHOOK_SECRET = previousWebhookSecret
        }
        expect(error).to.be.instanceOf(errors.ValidationError)
    })
})
