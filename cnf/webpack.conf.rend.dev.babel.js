import path from "path";
import merge from "webpack-merge";
import baseConf from "./webpack.conf";
import { spawn, execSync } from "child_process";

export default merge.smart(baseConf, {
  mode: "development",
  entry: [
    "webpack-dev-server/client?http://localhost:8080/",
    "./src/app/app.tsx"
  ],
  target: "electron-renderer",
  output: {
    filename: "rend.dev.js"
  },
  devServer: {
    hot: true,
    compress: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    before() {
      console.log("Starting Electron Main Process...");
      spawn("npm", ["run", "start-main-dev"], {
        shell: true,
        env: process.env,
        stdio: "inherit"
      })
        .on("close", code => process.exit(code))
        .on("error", spawnError => console.error(spawnError));
    }
  }
})
