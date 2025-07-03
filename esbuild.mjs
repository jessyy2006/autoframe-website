// to turn ts into js
import esbuild from "esbuild";
import path from "node:path";
import { dtsPlugin } from "esbuild-plugin-d.ts";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/lib.js",
    sourcemap: true,
    target: ["ESNext"],
    format: "esm",
    minify: false,
    platform: "browser",
    logLevel: "info",
    plugins: [
      dtsPlugin({
        tsconfig: path.resolve("./tsconfig.json"),
      }),
    ],
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
