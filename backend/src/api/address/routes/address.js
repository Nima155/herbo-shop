"use strict";

/**
 * address router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::address.address",
  { only: [] }
  /*{  
  only: ["find", "findOne"],
  config: {
    find: {
      auth: false,
      policies: ["plugin::users-permissions.csrfProtection"],
      middlewares: [
        async (ctx, next) => {
          console.log("hey there");
          csrfProtection(ctx, next);
        },
      ],
    },
  },
}*/
);
