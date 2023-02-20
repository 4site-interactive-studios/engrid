"use strict";

const fs = require("fs");

const lerna = require("./lerna.json");

fs.writeFileSync(
  "./packages/common/src/version.ts",
  `export const AppVersion = "${lerna.version}";`
);
