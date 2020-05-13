// in preload scripts, we have access to node.js and electron APIs
// the remote web app will not have access, so this is safe
const { contextBridge } = require('electron');

init();

function init() {
  let sqlite3 = require("sqlite3").verbose();
  let db = new sqlite3.Database("socmag.db");
  let _db = db;

  contextBridge.exposeInMainWorld("db", {

    batch: function (sql, params) {
      return new Promise((resolve, reject) => {
        console.log(`batch: ${sql}`);
        if (sql.trim().length === 0) {
          resolve("empty query");
        } else {
          _db.exec(sql, function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve("OK");
            }
          });
        }
      });
    },

    exec: function (sql, params) {
      return new Promise((resolve, reject) => {
        console.log(`exec: ${sql}`);
        if (sql.trim().length === 0) {
          resolve("empty query");
        } else {
          _db.run(sql, params, function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve("OK");
            }
          });
        }
      });
    },

    select: function (sql, params) {
      return new Promise((resolve, reject) => {
        _db.all(sql, params, function (err, rows) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
          }
        })
      });
    },

    selectOne: function (sql, params) {
      return new Promise((resolve, reject) => {
        _db.get(sql, params, function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        })
      });
    }

  });
}
