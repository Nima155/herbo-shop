"use strict";
const CSRF = require("koa-csrf");
const csrfProtection = new CSRF();

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
        "Query.addresses": {
          middlewares: [
            async (next, parent, args, context, info) => {
              context.koaContext.request.method = "GET";
              csrfProtection(context.koaContext, () => {});
              // call the next resolver
              // context.koaContext.csrf to access csrf token
              const res = await next(parent, args, context, info);
              return res;
            },
          ],
        },
      },
      types: [
        nexus.extendType({
          type: "UsersPermissionsMe",
          definition(t) {
            // here define fields you need
            t.list.field("addresses", { type: "Address" });
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
