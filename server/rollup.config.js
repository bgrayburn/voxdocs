// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/server.ts", // Entry file
  output: {
    file: "../dist/server.mjs", // Output bundle file
    format: "esm", // ES module format for Node.js
    entryFileNames: "[name].mjs", // Use .mjs extension for ES modules
    sourcemap: true, // Enable sourcemaps
  },
  plugins: [
    resolve(), // Resolves node_modules
    typescript(), // Handles TypeScript
    commonjs(), // Converts CommonJS to ESModules
    json(),
    terser(), // Minifies the bundle
  ],
  external: [
    // Specify external dependencies here (e.g., fs, path, etc. in Node.js)
    "path",
  ],
  context: "globalThis",
};
