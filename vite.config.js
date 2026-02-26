import handlebars from "vite-plugin-handlebars";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path, { resolve } from "path";
import fs from "fs";
import { glob } from "glob";
import globalContext from "./pages-data/globalContext";
import pagesConfig from "./pages.config";

function cssRelativePublicUrls() {
  return {
    name: "css-relative-public-urls",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith(".css") && chunk.type === "asset") {
          const depth = fileName.split("/").length - 1;
          const prefix = "../".repeat(depth);
          chunk.source = chunk.source.replace(
            /url\(\s*(['"]?)\/images\//g,
            `url($1${prefix}images/`,
          );
          chunk.source = chunk.source.replace(
            /url\(\s*(['"]?)\/fonts\//g,
            `url($1${prefix}fonts/`,
          );
        }
      }
    },
  };
}

function flattenPagesPlugin() {
  let outDir = "dist";
  return {
    name: "flatten-pages",
    enforce: "post",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url?.endsWith(".html") && !req.url.startsWith("/pages/")) {
          req.url = "/pages" + req.url;
        } else if (req.url === "/") {
          req.url = "/pages/index.html";
        } else if (
          req.url &&
          !req.url.startsWith("/pages/") &&
          !req.url.startsWith("/@") &&
          !req.url.startsWith("/src/") &&
          !req.url.startsWith("/node_modules/") &&
          !path.extname(req.url.split("?")[0])
        ) {
          req.url = "/pages" + req.url.split("?")[0] + ".html";
        }
        next();
      });
    },
    closeBundle() {
      const pagesDir = path.resolve(outDir, "pages");
      if (!fs.existsSync(pagesDir)) return;
      const files = fs.readdirSync(pagesDir);
      for (const file of files) {
        fs.renameSync(path.resolve(pagesDir, file), path.resolve(outDir, file));
      }
      fs.rmSync(pagesDir, { recursive: true });
    },
  };
}

export default {
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, "src/scss")],
      },
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      input: glob
        .sync("pages/*.html")
        .map((file) => path.resolve(__dirname, file)),
    },
  },
  esbuild: {
    target: "es2022",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
  server: {
    host: true,
  },
  plugins: [
    cssRelativePublicUrls(),
    flattenPagesPlugin(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/icons")],
      symbolId: "[name]",
    }),
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
      helpers: {
        times: (n, block) => {
          let accum = "";
          for (let i = 0; i < n; ++i) accum += block.fn(i);
          return accum;
        },
      },
      context(pagePath) {
        const normalized = pagePath.replace(/^\/pages\//, "/");
        return {
          ...globalContext,
          ...pagesConfig[normalized],
        };
      },
    }),
  ],
};
