const _ = require("lodash");
const utils = require("@strapi/utils");
const jwt = require("jsonwebtoken");

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;
const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};
const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = (plugin) => {
  const {
    validateCallbackBody,
    validateRegisterBody,
    validateSendEmailConfirmationBody,
  } = require("./validation/auth");
  plugin.services.jwt = ({ strapi }) => ({
    getToken(ctx) {
      let token;

      if (
        ctx.request &&
        ctx.request.header &&
        !ctx.request.header.authorization
      ) {
        const token = ctx.cookies.get("token");

        if (token) {
          ctx.request.header.authorization = "Bearer " + token;
        }
      }
      if (
        ctx.request &&
        ctx.request.header &&
        ctx.request.header.authorization
      ) {
        const parts = ctx.request.header.authorization.split(/\s+/);

        if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
          return null;
        }

        token = parts[1];
      } else {
        return null;
      }

      return this.verify(token);
    },

    issue(payload, jwtOptions = {}) {
      _.defaults(jwtOptions, strapi.config.get("plugin.users-permissions.jwt"));
      return jwt.sign(
        _.clone(payload.toJSON ? payload.toJSON() : payload),
        strapi.config.get("plugin.users-permissions.jwtSecret"),
        jwtOptions
      );
    },

    verify(token) {
      return new Promise(function (resolve, reject) {
        jwt.verify(
          token,
          strapi.config.get("plugin.users-permissions.jwtSecret"),
          {},
          function (err, tokenPayload = {}) {
            if (err) {
              return reject(new Error("Invalid token."));
            }
            resolve(tokenPayload);
          }
        );
      });
    },
  });

  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    if (provider === "local") {
      if (!_.get(await store.get({ key: "grant" }), "email.enabled")) {
        throw new ApplicationError("This provider is disabled");
      }

      await validateCallbackBody(params);

      const query = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: query });

      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }

      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        throw new ApplicationError("Your account email is not confirmed");
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        throw new ApplicationError(
          "This user never set a local password, please login with the provider used during account creation"
        );
      }

      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      } else {
        const jwt = getService("jwt").issue({
          id: user.id,
        });
        ctx.cookies.set("token", jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age
          domain:
            process.env.NODE_ENV === "development"
              ? "localhost"
              : process.env.PRODUCTION_URL,
        });
        ctx.send({
          status: "Authenticated",
          user: await sanitizeUser(user, ctx),
        });
      }
    } else {
      if (!_.get(await store.get({ key: "grant" }), [provider, "enabled"])) {
        throw new ApplicationError("This provider is disabled");
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await getService("providers").connect(
          provider,
          ctx.query
        );
      } catch ([user, error]) {
        throw new ApplicationError(error.message);
      }

      if (!user) {
        throw new ApplicationError(error.message);
      }

      ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }
  };

  // plugin.policies[newPolicy] = (ctx) => {};

  // plugin.routes.push({
  //   method: "GET",
  //   path: "/route-path",
  //   handler: "controller.action",
  // });

  return plugin;
};
