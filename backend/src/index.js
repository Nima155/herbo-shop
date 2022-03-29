"use strict";

const Stripe = require("stripe");
const CSRF = require("koa-csrf");
const csrfProtection = new CSRF();

const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY, {
  apiVersion: "2020-08-27",
});

const MIDDLEWARES = [
  async (next, parent, args, context, info) => {
    csrfProtection(context.koaContext, () => {});
    // call the next resolver
    // context.koaContext.csrf to access csrf token
    const res = await next(parent, args, context, info);
    return res;
  },
];

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");
    const { toEntityResponse } = strapi
      .plugin("graphql")
      .service("format").returnTypes;
    extensionService.use(({ nexus }) => ({
      resolversConfig: {
        "Mutation.login": {
          middlewares: MIDDLEWARES, // CSRF check
        },
        "Mutation.createAddress": {
          middlewares: MIDDLEWARES, // CSRF check
        },
        "Mutation.deleteAddress": {
          middlewares: [
            ...MIDDLEWARES,
            async (next, parent, args, ctx, info) => {
              if (!ctx.state.user.addresses.find((e) => e.id === +args.id)) {
                throw new Error("You are trying to do something naughty!");
              }
              return await next(parent, args, ctx, info);
            },
          ],
        },
        "Mutation.updateAddress": {
          middlewares: [
            ...MIDDLEWARES,

            async (next, parent, args, ctx, info) => {
              if (!ctx.state.user.addresses.find((e) => e.id === +args.id)) {
                throw new Error("You are trying to do something naughty!");
              }
              // console.log(args);
              if (args.data.is_shipping) {
                await strapi.db.query("api::address.address").updateMany({
                  where: {
                    id: ctx.state.user.addresses.map((e) => e.id),
                  },
                  data: {
                    is_shipping: false,
                  },
                });
              }
              // console.log(ctx.state.user.addresses);
              return await next(parent, args, ctx, info);
            },
          ], // CSRF check
        },
        "Query._csrf": {
          auth: false,
        },
        "Mutation.createOrderLists": {
          auth: false,
        },
      },
      resolvers: {
        Mutation: {
          updateAddress: {
            async resolve(_roots, args, ctx) {
              const entry = await strapi.entityService.update(
                "api::address.address",
                args.id,
                {
                  data: args.data,
                }
              );

              await stripe.customers.update(ctx.state.user.stripe_id, {
                shipping: {
                  name: `${entry.first_name} ${entry.last_name}`,
                  phone: entry.phone_number,
                  address: {
                    city: entry.city,
                    country: entry.country,
                    line1: entry.address_1,
                    postal_code: entry.zip_code,
                    state: entry.state,
                  },
                },
              });

              return toEntityResponse(entry, {
                args,
                resourceUID: "api::address.address",
              });
            },
          },
          createAddress: {
            async resolve(_rootz, args, ctx) {
              // console.log(strapi);

              if (ctx.state.user.addresses.length >= 3) {
                throw new Error("You can only save up to 3 addresses.");
              }

              if (!ctx.state.user.addresses.length) {
                args.data.is_shipping = true;
              }

              const entry = await strapi.entityService.create(
                "api::address.address",
                {
                  data: args.data,
                }
              );

              await strapi.entityService.update(
                "plugin::users-permissions.user",
                ctx.state.user.id,
                {
                  data: {
                    addresses: [...ctx.state.user.addresses, entry.id],
                  },
                }
              );

              if (!ctx.state.user.addresses.length) {
                await stripe.customers.update(ctx.state.user.stripe_id, {
                  shipping: {
                    name: `${entry.first_name} ${entry.last_name}`,
                    phone: entry.phone_number,
                    address: {
                      city: entry.city,
                      country: entry.country,
                      line1: entry.address_1,
                      postal_code: entry.zip_code,
                      state: entry.state,
                    },
                  },
                });
              }

              return toEntityResponse(entry, {
                args,
                resourceUID: "api::address.address",
              });
            },
          },
        },
      },
      types: [
        nexus.objectType({
          name: "BatchReturn",
          definition(t) {
            t.int("count");
          },
        }),
        nexus.extendInputType({
          type: "UsersPermissionsRegisterInput",
          definition(t) {
            t.string("stripe_id");
          },
        }),
        nexus.extendType({
          type: "UsersPermissionsMe",
          definition(t) {
            // here define fields you need
            t.list.field("addresses", { type: "AddressEntity" });
            t.field("stripe_id", { type: "String" });
          },
        }),
        nexus.extendType({
          type: "Query",
          definition(t) {
            t.string("_csrf", {
              resolve: (_rootz, _args, ctx) => {
                ctx.koaContext.request.method = "GET";
                csrfProtection(ctx.koaContext, () => {});
                return ctx.koaContext.csrf;
              },
            });
          },
        }),
        nexus.extendType({
          type: "Mutation",
          definition(t) {
            t.string("logout", {
              resolve(_rootz, _args, ctx) {
                ctx.koaContext.cookies.set("token", "", {
                  expires: new Date(0),
                });
                // ctx.cookies.set("token");
                return "successful logout";
              },
            });
            t.field("createOrderLists", {
              type: "BatchReturn",
              args: {
                data: nexus.nonNull(
                  nexus.list(nexus.nonNull("OrderListInput"))
                ),
              },
              async resolve(_rootz, args, ctx) {
                // ctx.cookies.set("token");

                const allUpdates = await Promise.all(
                  args.data.map((e) =>
                    strapi.entityService.create("api::order-list.order-list", {
                      data: e,
                    })
                  )
                );

                return { count: allUpdates.length };
              },
            });
          },
        }),
      ],
    }));

    strapi.service("plugin::users-permissions.user").fetchAuthenticatedUser = (
      id
    ) => {
      return strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { id }, populate: ["role", "addresses"] });
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
