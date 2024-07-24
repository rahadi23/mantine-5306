import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import path from "path";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import packageJson from "./package.json" assert { type: "json" };
import { delEmptyDirs } from "./utils/build.util.mjs";

const esmPath = path.dirname(packageJson.module);
const cjsPath = path.dirname(packageJson.main);

/** @type {import('rollup').RollupOptions | import('rollup').RollupOptions[]} */
const config = [
  // ESM
  {
    input: ["./src/index.ts"],
    output: [
      {
        dir: esmPath,
        format: "esm",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: (chunkInfo) => {
          // https://github.com/rollup/rollup/issues/3684
          if (chunkInfo.name.includes("node_modules")) {
            return chunkInfo.name.replace("node_modules", "external") + ".mjs";
          }

          return "[name].mjs";
        },
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      nodeExternals(),
      postcss({ extract: false, modules: true }),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: true,
        declarationDir: esmPath,
      }),
      terser(),
    ],
  },

  // CJS
  {
    input: ["./src/index.ts"],
    output: [
      {
        dir: cjsPath,
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: (chunkInfo) => {
          // https://github.com/rollup/rollup/issues/3684
          if (chunkInfo.name.includes("node_modules")) {
            return chunkInfo.name.replace("node_modules", "external") + ".cjs";
          }

          return "[name].cjs";
        },
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      nodeExternals(),
      postcss({ extract: false, modules: true }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.build.json" }),
      terser(),
    ],
  },

  // Types
  {
    input: path.join(esmPath, "index.d.ts"),
    output: [{ file: packageJson.types, format: "esm" }],
    plugins: [
      dts({ tsconfig: "./tsconfig.build.json" }),
      del({ targets: [`${esmPath}/**/*.d.ts`], hook: "generateBundle" }),
      delEmptyDirs({ path: "dist", verbose: true }),
    ],
  },
];

export default config;
