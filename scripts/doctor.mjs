import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";

const isCi = process.argv.includes("--ci");
const failures = [];

function run(command, args = []) {
  const result = spawnSync(command, args, { encoding: "utf8", shell: false });
  return {
    ok: result.status === 0,
    output: (result.stdout || result.stderr || "").trim()
  };
}

function report(label, result, hint) {
  if (result.ok) {
    console.log(`PASS ${label}${result.output ? `: ${result.output.split("\n")[0]}` : ""}`);
    return;
  }

  failures.push(label);
  console.log(`FAIL ${label}${hint ? `: ${hint}` : ""}`);
}

console.log("GIT/GITHUB TRAINING DOCTOR");

report("Git", run("git", ["--version"]), "install Git for Windows");

if (!isCi) {
  report("Bash", run("bash", ["--version"]), "open the check from Git Bash");
}

report("Node.js", { ok: Number(process.versions.node.split(".")[0]) >= 20, output: `v${process.versions.node}` }, "install current Node.js LTS");
report("npm", run(process.platform === "win32" ? "npm.cmd" : "npm", ["--version"]), "reinstall Node.js with npm in PATH");

if (!isCi) {
  const userName = run("git", ["config", "--global", "user.name"]);
  const userEmail = run("git", ["config", "--global", "user.email"]);
  const defaultBranch = run("git", ["config", "--global", "init.defaultBranch"]);

  report("Git user.name", { ok: userName.ok && Boolean(userName.output), output: userName.output }, "set git config --global user.name");
  report("Git user.email", { ok: userEmail.ok && Boolean(userEmail.output), output: userEmail.output }, "set git config --global user.email");
  report("Default branch main", { ok: defaultBranch.output === "main", output: defaultBranch.output }, "set git config --global init.defaultBranch main");
}

const chromiumPath = chromium.executablePath();
report("Playwright Chromium", { ok: existsSync(chromiumPath), output: chromiumPath }, "run npx playwright install chromium");

if (failures.length > 0) {
  console.log(`NOT READY (${failures.length} problem${failures.length === 1 ? "" : "s"})`);
  process.exitCode = 1;
} else {
  console.log("READY");
}
