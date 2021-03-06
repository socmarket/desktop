const merge  = require("webpack-merge");
const baseConf  = require("./webpack.conf");

module.exports = merge.smart(baseConf, {
  entry: "./src/main.ts",
  target: "electron-main",
})
