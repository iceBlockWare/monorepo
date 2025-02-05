/* eslint-disable @typescript-eslint/naming-convention */

import { MetaManifest as OldManifest } from "../0.0.1-prealpha.2";
import { MetaManifest as NewManifest } from "../0.0.1-prealpha.3";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    __type: "MetaManifest",
    format: "0.0.1-prealpha.3",
  };
}
