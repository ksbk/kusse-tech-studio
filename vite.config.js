import { defineConfig } from "vite";
import { resolve } from "path";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  // Set root to frontend directory
  root: "frontend",

  // Entry point configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "frontend/src/scripts/app/main.js"),
      },
      output: {
        dir: resolve(__dirname, "app/static/dist"),
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
    outDir: resolve(__dirname, "app/static/dist"),
    assetsDir: "",
    sourcemap: process.env.NODE_ENV === "production" ? true : "inline",
    emptyOutDir: true,
    manifest: true, // Enable manifest for Flask integration
  },

  // Public directory configuration
  publicDir: false, // Disable as we're managing assets differently

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        // Remove additionalData to avoid conflicts with @use rules
      },
    },
    devSourcemap: true,
  },

  // Resolve configuration (equivalent to webpack aliases)
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend/src"),
      "@scripts": resolve(__dirname, "frontend/src/scripts"),
      "@styles": resolve(__dirname, "frontend/src/styles"),
      "@assets": resolve(__dirname, "frontend/src/assets"),
      "@components": resolve(__dirname, "frontend/src/components"),
      "@images": resolve(__dirname, "frontend/src/assets/images"),
    },
  },

  // Plugins
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],

  // Server configuration for development
  server: {
    port: 3000,
    open: false,
    cors: true,
    hmr: {
      port: 3001,
    },
  },

  // Base path configuration
  base: "/static/dist/",

  // Define environment variables
  define: {
    __DEV__: process.env.NODE_ENV === "development",
  },
});
