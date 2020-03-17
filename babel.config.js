/* eslint global-require: off, import/no-extraneous-dependencies: off */

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  const isProd = process.env.NODE_ENV === "production";
  return {
    presets: [
      require("@babel/preset-env"),
      require("@babel/preset-react"),
      require("@babel/preset-typescript"),
    ],
    plugins: [
      ...(isProd ? [] : [ "react-refresh/babel" ]),
      [ "@babel/plugin-transform-runtime", { "regenerator": true } ]
    ],
  };
};
