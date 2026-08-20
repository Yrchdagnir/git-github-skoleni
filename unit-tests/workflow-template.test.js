import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const template = readFileSync(
  new URL("../workshop/templates/pr-message.yml", import.meta.url),
  "utf8"
);

test("PR message template leaves the event, branch and message to the participant", () => {
  assert.match(template, /^\s+WORKSHOP_EVENT:$/m);
  assert.match(template, /branches: \[WORKSHOP_BRANCH\]/);
  assert.match(template, /echo "WORKSHOP_MESSAGE"/);
  assert.doesNotMatch(template, /^\s+pull_request:$/m);
  assert.doesNotMatch(template, /branches: \[main\]/);
});
