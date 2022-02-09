module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '0b9050d21a128d2ce90bfccfe2cbf2cd'),
  },
});
