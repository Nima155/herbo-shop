"use strict";
const CSRF = require("koa-csrf");
const csrfProtection = new CSRF();
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
    extensionService.use(({ nexus }) => ({
      resolversConfig: {
        "Mutation.login": {
          middlewares: MIDDLEWARES, // CSRF check
        },

        "Query._csrf": {
          auth: false,
        },
      },
      // resolvers: {
      //   Mutation: {
      //     createOrder: {
      //       resolve(_rootz, _args, ctx) {
      //         // console.log(strapi);
      //         console.log(_args);
      //       },
      //     },
      //   },
      // },
      types: [
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
            t.list.field("addresses", { type: "Address" });
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
