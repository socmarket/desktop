module.exports = {
  packagerConfig: {
    quiet: false
  },
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./cnf/webpack.conf.main.js",
        renderer: {
          config: "./cnf/webpack.conf.rend.js",
          entryPoints: [
            {
              js: "./src/app.tsx",
              html: "./src/index.html",
              name: "main_window",
              preload: {
                js: "./src/preload.ts",
              },
            }
          ]
        }
      }
    ]
  ],
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "socmag_electro"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: [
        "linux"
      ]
    }
  ]
};
