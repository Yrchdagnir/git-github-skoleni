const title = process.env.PR_TITLE?.trim() ?? "";
const pattern = /^(feat|fix|docs|test|ci|chore|refactor)(\([a-z0-9._-]+\))?!?: .+/;

if (!title) {
  console.error("PR_TITLE is missing. The script must run from a pull_request workflow.");
  process.exit(1);
}

if (!pattern.test(title)) {
  console.error(`Invalid PR title: ${title}`);
  console.error("Use: type: short description");
  console.error("Allowed types: feat, fix, docs, test, ci, chore, refactor");
  console.error("Example: feat(recipes): add focus potion");
  process.exit(1);
}

console.log(`Valid semantic PR title: ${title}`);
