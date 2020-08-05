const webpack = require("webpack")
const path = require("path")
const proc = require("process")
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const pckg = require("../package.json")

const git = new GitRevisionPlugin()

module.exports = {
  plugins: [
    git,
    new webpack.DefinePlugin({
      "API_BASE_URL": JSON.stringify("http://127.0.0.1:3001"),
      "UPDATES_HOST": JSON.stringify("http://127.0.0.1"),
      "VERSION": JSON.stringify({
        hash: git.commithash(),
        date: (new Date()).toISOString(),
        branch: git.branch(),
        value: pckg.version,
      }),
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      Api: path.resolve("src/api"),
      Ui: path.resolve("src/ui"),
      Util: path.resolve("src/util"),
      Img: path.resolve("src/ui/img"),
      Font: path.resolve("src/ui/font"),
      View: path.resolve("src/ui/view"),
      Store: path.resolve("src/ui/store"),
      Style: path.resolve("src/ui/style"),
    }
  },
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
      },
      {
        test: /\.json5$/i,
        loader: 'json5-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader" ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
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
        test: /\.tspl$/,
        use: {
          loader: "raw-loader",
        }
      },
      {
        test: /sqlite3\.js$/,
        use: {
          loader: "string-replace-loader",
          options: {
            search  : "var sqlite3 = require('./sqlite3-binding.js');",
            replace : `var sqlite3 = require('./binding/electron-v8.2-${proc.platform}-${proc.arch}/node_sqlite3.node');`
          },
        },
      },
      {
        test: /\.(m?js|node)$/,
        use: {
          loader: '@marshallofsound/webpack-asset-relocator-loader',
          options: {
          }
        }
      },
    ]
  },
};
