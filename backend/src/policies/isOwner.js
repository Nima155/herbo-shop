"use strict";

/**
 * `isOwner` policy.
 */

module.exports = (policyContext, config, { strapi }) => {
  if (+policyContext.args.id !== policyContext.state.user.id) {
    return false;
  }

  return true;
};
