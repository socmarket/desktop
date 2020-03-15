import path from "path";
import merge from "webpack-merge";
import baseConf from "./webpack.conf";

export default merge.smart(baseConf, {
  mode: "production",
  entry: "./src/app/main.ts",
  target: "electron-main",
  output: {
    filename: "main.js"
  }
})
