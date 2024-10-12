// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/server.ts", // Entry file
  output: {
    file: "../dist/server.js", // Output bundle file
    format: "es", // ES module format for Node.js
    sourcemap: true, // Enable sourcemaps
  },
  plugins: [
    resolve(), // Resolves node_modules
    commonjs(), // Converts CommonJS to ESModules
    json(),
    typescript(), // Handles TypeScript
    terser(), // Minifies the bundle
  ],
  external: [
    // Specify external dependencies here (e.g., fs, path, etc. in Node.js)
    "path",
  ],
  context: "globalThis",
};
