/* eslint-disable @typescript-eslint/no-explicit-any */
import { Web3API } from "./Web3API";
import { displayPath } from "./helpers/path";
import { step, withSpinner } from "./helpers/spinner";

import fs from "fs";
import path from "path";
import * as asc from "assemblyscript/cli/asc";
import { Manifest } from "@web3api/client-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const toolbox = require("gluegun/toolbox");

export interface CompilerConfig {
  manifestPath: string;
  outputDir: string;
  outputFormat: string;
}

export class Compiler {
  private _manifestDir: string;

  constructor(private _config: CompilerConfig) {
    this._manifestDir = path.dirname(_config.manifestPath);
  }

  public async compile(): Promise<boolean> {
    try {
      // Load the API
      const api = await this._loadWeb3API();

      // Init & clean build directory
      const { outputDir } = this._config;

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      fsExtra.emptyDirSync(outputDir);

      // Compile the API
      await this._compileWeb3API(api);

      return true;
    } catch (e) {
      toolbox.print.error(e);
      return false;
    }
  }

  private async _loadWeb3API(quiet = false): Promise<Manifest> {
    const run = () => {
      return Web3API.load(this._config.manifestPath);
    };

    if (quiet) {
      return run();
    } else {
      const manifestPath = displayPath(this._config.manifestPath);

      return await withSpinner(
        `Load web3api from ${manifestPath}`,
        `Failed to load web3api from ${manifestPath}`,
        `Warnings loading web3api from ${manifestPath}`,
        async (_spinner) => {
          return run();
        }
      );
    }
  }

  private async _compileWeb3API(
    manifest: Manifest,
    quiet?: boolean,
    verbose?: boolean
  ) {
    const run = async (spinner?: any) => {
      const { mutation, query } = manifest;
      const { outputDir, manifestPath } = this._config;

      const appendPath = (root: string, subPath: string) => {
        return path.join(path.dirname(root), subPath);
      };

      let schema = "";
      const loadSchema = (schemaPath: string) => {
        schema += `${fs.readFileSync(
          path.isAbsolute(schemaPath)
            ? schemaPath
            : appendPath(manifestPath, schemaPath),
          "utf-8"
        )}\n`;
      };

      if (mutation) {
        loadSchema(mutation.schema.file);
        await this._compileWasmModule(
          mutation.module.file,
          "mutation",
          outputDir,
          spinner,
          quiet,
          verbose
        );
        mutation.module.file = "./mutation.wasm";
      }

      if (query) {
        loadSchema(query.schema.file);
        await this._compileWasmModule(
          query.module.file,
          "query",
          outputDir,
          spinner,
          quiet,
          verbose
        );
        query.module.file = "./query.wasm";
        query.schema.file = "./schema.graphql";
      }

      fs.writeFileSync(`${outputDir}/schema.graphql`, schema, "utf-8");

      Web3API.dump(manifest, `${outputDir}/web3api.yaml`);

      // TODO: add validation
      // - WASM modules
      // - WASM exports <> GraphQL Schema
      // - Schemas
    };

    if (quiet) {
      return run();
    } else {
      return await withSpinner(
        "Compile Web3API",
        "Failed to compile Web3API",
        "Warnings while compiling Web3API",
        async (spinner) => {
          return run(spinner);
        }
      );
    }
  }

  private async _compileWasmModule(
    modulePath: string,
    moduleName: string,
    outputDir: string,
    spinner?: any,
    quiet?: boolean,
    verbose?: boolean
  ) {
    if (!quiet) {
      step(
        spinner,
        "Compiling WASM module:",
        `${modulePath} => ${outputDir}/${moduleName}.wasm`
      );
    }

    const moduleAbsolute = path.join(this._manifestDir, modulePath);
    const baseDir = path.dirname(moduleAbsolute);
    const libsDirs = [];
    let w3Wasm = "";

    for (
      let dir: string | undefined = path.resolve(baseDir);
      // Terminate after the root dir or when we have found node_modules
      dir !== undefined;
      // Continue with the parent directory, terminate after the root dir
      dir = path.dirname(dir) === dir ? undefined : path.dirname(dir)
    ) {
      if (fs.existsSync(path.join(dir, "node_modules"))) {
        libsDirs.push(path.join(dir, "node_modules"));
        if (fs.existsSync(path.join(dir, "node_modules/@web3api/wasm-as"))) {
          w3Wasm = path.resolve(
            dir,
            "node_modules/@web3api/wasm-as/assembly/index.ts"
          );
        }
      }
    }

    if (libsDirs.length === 0) {
      throw Error(
        `could not locate \`node_modules\` in parent directories of web3api manifest`
      );
    }

    const args = [
      w3Wasm,
      moduleAbsolute,
      "--baseDir",
      baseDir,
      "--lib",
      libsDirs.join(","),
      "--outFile",
      `${outputDir}/${moduleName}.wasm`,
      "--optimize",
      "--debug",
      "--runtime",
      "full",
    ];

    // compile the module into the output directory
    await asc.main(
      args,
      {
        stdout: !verbose ? undefined : process.stdout,
        stderr: process.stderr,
      },
      (e: Error | null) => {
        if (e != null) {
          throw e;
        }
        return 0;
      }
    );
  }
}
