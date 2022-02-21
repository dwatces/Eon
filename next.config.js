const Uglify = require('uglifyjs-webpack-plugin');


module.exports = {
  webpack: function (c) {
    c.plugins = c.plugins.filter(
      (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
    )

    c.plugins.push(
      new Uglify()
    );

    return c;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};
