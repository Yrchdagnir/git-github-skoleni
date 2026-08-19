import { recipes } from "./generated-recipes.js";

const translations = {
  cs: {
    documentTitle: "Archiv lektvarů",
    workshop: "Dílna U Tří Tyglíků",
    title: "Archiv lektvarů",
    eyebrow: "Otevřený alchymistický katalog",
    introTitle: "Recepty připravené na další výpravu",
    introText: "Každý lektvar má jeden užitek, jedno omezení a krátký seznam ingrediencí.",
    listLabel: "Seznam lektvarů",
    limitation: "Omezení",
    showIngredients: "Ukázat ingredience",
    hideIngredients: "Skrýt ingredience",
    imageAlt: name => `Lahvička lektvaru ${name}`,
    recipeCount: count => `${count} ${count === 1 ? "recept" : count < 5 ? "recepty" : "receptů"}`
  },
  sk: {
    documentTitle: "Archív elixírov",
    workshop: "Dielňa U Troch Téglikov",
    title: "Archív elixírov",
    eyebrow: "Otvorený alchymistický katalóg",
    introTitle: "Recepty pripravené na ďalšiu výpravu",
    introText: "Každý elixír má jeden úžitok, jedno obmedzenie a krátky zoznam ingrediencií.",
    listLabel: "Zoznam elixírov",
    limitation: "Obmedzenie",
    showIngredients: "Ukázať ingrediencie",
    hideIngredients: "Skryť ingrediencie",
    imageAlt: name => `Fľaštička elixíru ${name}`,
    recipeCount: count => `${count} ${count === 1 ? "recept" : count < 5 ? "recepty" : "receptov"}`
  }
};

const potionList = document.querySelector("#potion-list");
const template = document.querySelector("#potion-template");
const recipeCount = document.querySelector("#recipe-count");
const languageButtons = [...document.querySelectorAll("[data-locale]")];
const storedLocale = localStorage.getItem("potion-locale");
let activeLocale = storedLocale === "sk" ? "sk" : "cs";

function initials(name) {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function potionCard(recipe, text) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".potion-card");
  const media = fragment.querySelector(".potion-media");
  const title = fragment.querySelector("h3");
  const effect = fragment.querySelector(".potion-effect");
  const limitationLabel = fragment.querySelector(".potion-limitation strong");
  const limitation = fragment.querySelector(".potion-limitation span");
  const ingredientList = fragment.querySelector(".ingredient-list");
  const button = fragment.querySelector(".ingredient-toggle");

  card.dataset.potionId = recipe.slug;
  title.textContent = recipe.name;
  effect.textContent = recipe.effect;
  limitationLabel.textContent = text.limitation;
  limitation.textContent = recipe.limitation;

  if (recipe.image) {
    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = text.imageAlt(recipe.name);
    media.append(image);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "potion-initials";
    fallback.textContent = initials(recipe.name);
    fallback.setAttribute("aria-hidden", "true");
    media.append(fallback);
  }

  recipe.ingredients.forEach(ingredient => {
    const item = document.createElement("li");
    item.textContent = ingredient;
    ingredientList.append(item);
  });

  button.textContent = text.showIngredients;
  button.setAttribute("aria-label", `${text.showIngredients}: ${recipe.name}`);
  button.addEventListener("click", () => {
    const willShow = ingredientList.hidden;
    ingredientList.hidden = !willShow;
    const label = willShow ? text.hideIngredients : text.showIngredients;
    button.textContent = label;
    button.setAttribute("aria-label", `${label}: ${recipe.name}`);
  });

  return fragment;
}

function render() {
  const text = translations[activeLocale];
  const visibleRecipes = recipes.filter(recipe => recipe.locale === activeLocale);

  document.documentElement.lang = activeLocale;
  document.title = text.documentTitle;
  document.querySelector("#workshop-name").textContent = text.workshop;
  document.querySelector("#archive-name").textContent = text.title;
  document.querySelector("#archive-eyebrow").textContent = text.eyebrow;
  document.querySelector("#archive-title").textContent = text.introTitle;
  document.querySelector("#archive-description").textContent = text.introText;
  potionList.setAttribute("aria-label", text.listLabel);
  recipeCount.textContent = text.recipeCount(visibleRecipes.length);
  potionList.replaceChildren();
  visibleRecipes.forEach(recipe => potionList.append(potionCard(recipe, text)));

  languageButtons.forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.locale === activeLocale));
  });
}

languageButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeLocale = button.dataset.locale;
    localStorage.setItem("potion-locale", activeLocale);
    render();
  });
});

render();
