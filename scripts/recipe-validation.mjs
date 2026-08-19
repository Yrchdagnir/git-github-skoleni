import { existsSync } from "node:fs";

const requiredTextFields = ["slug", "name", "effect", "limitation"];
const supportedLocales = new Set(["cs", "sk"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hasNonEmptyLines = value =>
  typeof value === "string" &&
  value.trim() !== "" &&
  value.split(/\r\n|\r|\n/).every(line => line.trim() !== "");
const normalized = value => typeof value === "string" ? value.trim() : value;

export function validateRecipe(recipe, { path, templateRecipe, imageExists = existsSync }) {
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

  if (recipe.image && !imageExists(recipe.image)) {
    throw new Error(`${path}: obrázek "${recipe.image}" neexistuje`);
  }

  const unchangedFields = requiredTextFields.filter(
    field => normalized(recipe[field]) === normalized(templateRecipe[field])
  );
  if (unchangedFields.length > 0) {
    throw new Error(
      `${path}: nahraď výchozí text ze šablony v polích: ${unchangedFields.join(", ")}`
    );
  }

  const templateIngredients = new Set(templateRecipe.ingredients.map(normalized));
  const unchangedIngredients = recipe.ingredients.filter(
    ingredient => templateIngredients.has(normalized(ingredient))
  );
  if (unchangedIngredients.length > 0) {
    throw new Error(
      `${path}: nahraď výchozí ingredience ze šablony: ${unchangedIngredients.join(", ")}`
    );
  }
}
