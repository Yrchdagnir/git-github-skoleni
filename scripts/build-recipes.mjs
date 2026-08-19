import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { validateRecipe } from "./recipe-validation.mjs";

const recipeDirectory = "recipes";
const templateRecipe = JSON.parse(
  readFileSync(join(recipeDirectory, "_template.json"), "utf8")
);
const files = readdirSync(recipeDirectory)
  .filter(file => file.endsWith(".json") && !file.startsWith("_"))
  .sort();

const recipes = files.map(file => {
  const path = join(recipeDirectory, file);
  let recipe;

  try {
    recipe = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path}: není platný JSON (${error.message})`);
  }

  validateRecipe(recipe, { path, templateRecipe });

  return recipe;
});

const translationKeys = recipes.map(recipe => `${recipe.locale}:${recipe.slug}`);
if (new Set(translationKeys).size !== translationKeys.length) {
  throw new Error("Každý recept musí mít unikátní kombinaci locale a slug");
}

writeFileSync(
  "generated-recipes.js",
  `export const recipes = ${JSON.stringify(recipes, null, 2)};\n`
);

console.log(`Sestaveno ${recipes.length} jazykových variant receptů.`);
