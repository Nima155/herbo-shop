"use strict";
const Stripe = require("stripe");
/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY, {
  apiVersion: "2020-08-27",
});
const unparsed = Symbol.for("unparsedBody");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    // some logic here

    const rawBody = ctx.request.body[unparsed];

    // some more logic
    const sig = ctx.request.header["stripe-signature"];

    let event;

    let order;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.WEBHOOK_SECRET
      );
    } catch (err) {
      return ctx.badRequest("Webhook error", { message: err.message });
    }

    // Handle the event
    switch (event?.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        break;
      // ... handle other event types
      case "checkout.session.completed":
        const completedSession = event.data.object;

        const sess = await stripe.checkout.sessions.retrieve(
          completedSession.id,
          {
            expand: ["line_items", "line_items.data.price.product"],
          }
        );

        order = await strapi.entityService.create("api::order.order", {
          data: {
            user: sess.metadata.userId,
            total_cost: sess.amount_total / 100,
          },
        });

        await Promise.all(
          sess.line_items.data.map(({ price, quantity }) =>
            strapi.entityService.create("api::order-list.order-list", {
              data: {
                quantity,
                product: price.product.metadata.id,
                order: order.id,
              },
            })
          )
        );

        break;

      default:
        console.log(`Unhandled event type ${event?.type}`);
    }

    return order;
  },
}));
