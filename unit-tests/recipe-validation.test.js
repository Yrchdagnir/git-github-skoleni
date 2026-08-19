import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateRecipe } from "../scripts/recipe-validation.mjs";

const templateRecipe = JSON.parse(
  readFileSync(new URL("../recipes/_template.json", import.meta.url), "utf8")
);
const cloneTemplate = () => structuredClone(templateRecipe);
const validationOptions = {
  path: "recipes/participant-potion.json",
  templateRecipe,
  imageExists: () => true
};

test("rejects unchanged text fields from the recipe template", () => {
  assert.throws(
    () => validateRecipe(cloneTemplate(), validationOptions),
    /nahraď výchozí text ze šablony v polích: slug, name, effect, limitation/
  );
});

test("rejects a single unchanged template ingredient", () => {
  const recipe = {
    ...cloneTemplate(),
    slug: "ada-lektvar-soustredeni",
    name: "Lektvar soustředění",
    effect: "Pomůže dokončit rozepsaný recept.",
    limitation: "Účinkuje deset minut.",
    ingredients: ["první ingredience", "kapka rosy"]
  };

  assert.throws(
    () => validateRecipe(recipe, validationOptions),
    /nahraď výchozí ingredience ze šablony: první ingredience/
  );
});

test("accepts a fully customized recipe", () => {
  const recipe = {
    locale: "cs",
    slug: "ada-lektvar-soustredeni",
    name: "Lektvar soustředění",
    effect: "Pomůže dokončit rozepsaný recept.",
    limitation: "Účinkuje deset minut.",
    ingredients: ["šalvěj", "kapka rosy"],
    image: null
  };

  assert.doesNotThrow(() => validateRecipe(recipe, validationOptions));
});
