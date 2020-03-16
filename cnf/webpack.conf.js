const path = require("path");
import HtmlWebpackPlugin from "html-webpack-plugin";


module.exports = {
  entry: "./src/app/main.ts",
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [ "css-loader", "style-loader" ]
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: [ "file-loader" ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: ["node_modules"]
  },
  output: {
    path: path.resolve(__dirname, "..", "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html"
    })
  ]
};
