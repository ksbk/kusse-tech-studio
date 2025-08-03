import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Entry point configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve("frontend/src/scripts/app/main.js"),
      },
      output: {
        dir: resolve("app/static/dist"),
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          if (assetInfo.name.match(/\.(png|svg|jpg|jpeg|gif)$/i)) {
            return "images/[name][extname]";
          }
          if (assetInfo.name.match(/\.(woff|woff2|eot|ttf|otf)$/i)) {
            return "fonts/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    outDir: resolve("app/static/dist"),
    assetsDir: "",
    sourcemap: process.env.NODE_ENV === "production" ? true : "inline",
    emptyOutDir: true,
    manifest: true,
    target: "es2015", // Modern browser support without legacy plugin
  },

  publicDir: "frontend/src/assets",

  css: {
    preprocessorOptions: {
      scss: {},
    },
    devSourcemap: true,
  },

  resolve: {
    alias: {
      "@": resolve("frontend/src"),
      "@scripts": resolve("frontend/src/scripts"),
      "@styles": resolve("frontend/src/styles"),
      "@assets": resolve("frontend/src/assets"),
      "@components": resolve("frontend/src/components"),
      "@images": resolve("frontend/src/assets/images"),
    },
  },

  // Removed legacy plugin to fix crypto.hash error
  plugins: [],

  server: {
    port: 3000,
    open: false,
    cors: true,
    hmr: {
      port: 3001,
    },
  },

  base: "/static/dist/",

  define: {
    __DEV__: process.env.NODE_ENV === "development",
  },
});
