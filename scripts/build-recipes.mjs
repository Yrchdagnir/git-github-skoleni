import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const recipeDirectory = "recipes";
const requiredTextFields = ["slug", "name", "effect", "limitation"];
const supportedLocales = new Set(["cs", "sk"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hasNonEmptyLines = value =>
  typeof value === "string" &&
  value.trim() !== "" &&
  value.split(/\r\n|\r|\n/).every(line => line.trim() !== "");
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

  for (const field of requiredTextFields) {
    if (!hasNonEmptyLines(recipe[field])) {
      throw new Error(`${path}: pole "${field}" musí obsahovat text bez prázdných řádků`);
    }
  }

  if (!supportedLocales.has(recipe.locale)) {
    throw new Error(`${path}: pole "locale" musí být "cs" nebo "sk"`);
  }

  if (!slugPattern.test(recipe.slug)) {
    throw new Error(
      `${path}: pole "slug" smí obsahovat jen malá písmena, číslice a pomlčky`
    );
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length < 2) {
    throw new Error(`${path}: pole "ingredients" musí obsahovat alespoň dvě ingredience`);
  }

  if (!recipe.ingredients.every(hasNonEmptyLines)) {
    throw new Error(`${path}: každá ingredience musí obsahovat text bez prázdných řádků`);
  }

  if (recipe.image !== null && !hasNonEmptyLines(recipe.image)) {
    throw new Error(`${path}: pole "image" musí být neprázdná cesta k obrázku nebo null`);
  }

  if (recipe.image && !existsSync(recipe.image)) {
    throw new Error(`${path}: obrázek "${recipe.image}" neexistuje`);
  }

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
