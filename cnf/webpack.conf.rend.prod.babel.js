import path from "path";
import merge from "webpack-merge";
import baseConf from "./webpack.conf";

export default merge.smart(baseConf, {
  mode: "production",
  entry: "./src/app/app.tsx",
  target: "electron-preload",
  output: {
    filename: "rend.js"
  }
})

