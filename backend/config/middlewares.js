module.exports = [
  "strapi::errors",
  "strapi::security",

  {
    // custom resolve to find a package or a path
    name: "strapi::cors",
    config: {
      enabled: true,
      credentials: true,
      maxAge: 31536000,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "x-xsrf-token",
      ],
      origin: ["http://localhost:3000", "http://localhost:1337"],
      keepHeadersOnError: false,
    },
  },
  {
    name: "strapi::body",
    config: {
      includeUnparsed: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",

  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
