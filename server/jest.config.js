const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  globals: {
    "NODE_ENV": "test"
  },
  transform: {
    ...tsJestTransformCfg,
  },

};