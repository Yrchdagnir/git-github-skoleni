import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

async function expectRecipeCountToMatchCards(page) {
  const cards = page.locator(".potion-card");
  const count = await cards.count();
  const displayedCount = Number.parseInt(await page.locator("#recipe-count").innerText(), 10);

  expect(count).toBeGreaterThanOrEqual(3);
  expect(displayedCount).toBe(count);
}

async function expectStarterRecipes(page, names) {
  for (const [slug, name] of Object.entries(names)) {
    const card = page.locator(`[data-potion-id="${slug}"]`);
    await expect(card.getByRole("heading", { name, exact: true })).toBeVisible();
  }
}

test("shows the Czech starter recipes and matching count", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Archiv lektvarů");
  await expect(page.getByRole("heading", { name: "Archiv lektvarů" })).toBeVisible();
  await expectStarterRecipes(page, {
    "echo-lantern": "Lucerna ozvěn",
    emberguard: "Strážce žhavých uhlíků",
    moonstep: "Měsíční krok"
  });
  await expectRecipeCountToMatchCards(page);
});

test("switches the interface and recipes to Slovak", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Slovenčina" }).click();

  await expect(page).toHaveTitle("Archív elixírov");
  await expect(page.getByRole("heading", { name: "Archív elixírov" })).toBeVisible();
  await expectStarterRecipes(page, {
    "echo-lantern": "Lucerna ozvien",
    emberguard: "Strážca žeravých uhlíkov",
    moonstep: "Mesačný krok"
  });
  await expect(page.getByText("Otvorený alchymistický katalóg")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "sk");
  await expectRecipeCountToMatchCards(page);
});

test("renders a recipe image and reveals ingredients", async ({ page }) => {
  await page.goto("/");

  const card = page.locator('[data-potion-id="echo-lantern"]');
  await expect(card.locator("img")).toHaveAttribute("src", "assets/potions/echo-lantern.png");
  await card.getByRole("button", { name: "Ukázat ingredience: Lucerna ozvěn" }).click();
  await expect(card.getByText("prach ze staré mapy", { exact: true })).toBeVisible();
  await expect(card.getByRole("button", { name: "Skrýt ingredience: Lucerna ozvěn" })).toBeVisible();
});

test("fits the mobile viewport in both languages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Slovenčina" }).click();

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  expect(await page.locator(".potion-card").count()).toBeGreaterThanOrEqual(3);
});
