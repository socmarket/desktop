const path = require("path");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
   rules: [
       {
          test: /sqlite3\.js$/,
          use: {
              loader: "string-replace-loader",
              options: {
                  multiple: [
                      {
                        search  : "var sqlite3 = require('./sqlite3-binding.js');",
                        replace : "var sqlite3 = require('./binding/electron-v8.2-linux-x64/node_sqlite3.node');"
                      }
                  ],
              },
          },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader" ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: "file-loader",
        publicPath: ".."
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
        publicPath: ".."
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
            publicPath: ".."
          }
        }
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            publicPath: ".."
          }
        }
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            publicPath: ".."
          }
        }
      },
      {
        test: /\.sql$/,
        use: {
          loader: "raw-loader",
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ]
  },
};
