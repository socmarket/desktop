/* eslint global-require: off, import/no-extraneous-dependencies: off */

module.exports = api => {
  api.cache(true);
  return {
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
    plugins: [
      ...( (process.env.NODE_ENV === "production") ? [] : [ require('react-refresh/babel') ] )
    ]
  };
};
