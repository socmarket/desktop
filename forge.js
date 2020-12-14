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
              html: "./src/app.html",
              name: "app_win",
              preload: {
                js: "./src/appPreload.ts",
              },
            },
            {
              js: "./src/printPreview.tsx",
              html: "./src/printPreview.html",
              name: "print_preview_win",
              preload: {
                js: "./src/printPreviewPreload.ts",
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
        name: "socmarket"
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
