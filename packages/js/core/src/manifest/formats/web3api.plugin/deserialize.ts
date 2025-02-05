/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/deserialize-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/deserialize-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  PluginManifest,
  AnyPluginManifest,
  migratePluginManifest,
  validatePluginManifest,
  latestPluginManifestFormat,
} from ".";
import { DeserializeManifestOptions } from "../../";

import { compare } from "semver";
import YAML from "js-yaml";
import { Tracer } from "@web3api/tracing-js";

export const deserializePluginManifest = Tracer.traceFunc(
  "core: deserializePluginManifest",
  (manifest: string, options?: DeserializeManifestOptions): PluginManifest => {
    let anyPluginManifest: AnyPluginManifest | undefined;
    try {
      anyPluginManifest = JSON.parse(manifest) as AnyPluginManifest;
    } catch (e) {
      anyPluginManifest = YAML.safeLoad(manifest) as
      | AnyPluginManifest
      | undefined;
    }

    if (!anyPluginManifest) {
      throw Error(`Unable to parse PluginManifest: ${manifest}`);
    }

    if (!options || !options.noValidate) {
      validatePluginManifest(anyPluginManifest, options?.extSchema);
    }

    anyPluginManifest.__type = "PluginManifest";

    const versionCompare = compare(
      anyPluginManifest.format,
      latestPluginManifestFormat
    );

    if (versionCompare === -1) {
      // Upgrade
      return migratePluginManifest(anyPluginManifest, latestPluginManifestFormat);
    } else if (versionCompare === 1) {
      // Downgrade
      throw Error(
        `Cannot downgrade Web3API version ${anyPluginManifest.format}, please upgrade your Web3ApiClient package.`
      );
    } else {
      // Latest
      return anyPluginManifest as PluginManifest;
    }
  }
);
