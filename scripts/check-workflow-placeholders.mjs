import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const workflowDirectory = ".github/workflows";
const placeholderPattern = /WORKSHOP_(?:EVENT|BRANCH|MESSAGE)/g;
const workflowFiles = readdirSync(workflowDirectory)
  .filter(file => /\.ya?ml$/i.test(file))
  .sort();
const failures = [];

for (const file of workflowFiles) {
  const path = join(workflowDirectory, file);
  const placeholders = [...new Set(readFileSync(path, "utf8").match(placeholderPattern) ?? [])];

  if (placeholders.length > 0) {
    failures.push(`${path}: nahraď ${placeholders.join(", ")}`);
  }
}

if (failures.length > 0) {
  throw new Error(`Workflow obsahuje nedoplněné hodnoty ze šablony:\n${failures.join("\n")}`);
}

console.log(`Zkontrolováno ${workflowFiles.length} aktivních workflow bez zástupných hodnot.`);
