import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("shows the three Czech starter recipes", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Archiv lektvarů");
  await expect(page.getByRole("heading", { name: "Archiv lektvarů" })).toBeVisible();
  await expect(page.locator(".potion-card")).toHaveCount(3);
  await expect(page.getByText("3 recepty", { exact: true })).toBeVisible();
});

test("switches the interface and recipes to Slovak", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Slovenčina" }).click();

  await expect(page).toHaveTitle("Archív elixírov");
  await expect(page.getByRole("heading", { name: "Archív elixírov" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lucerna ozvien" })).toBeVisible();
  await expect(page.getByText("Otvorený alchymistický katalóg")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "sk");
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
  await expect(page.locator(".potion-card")).toHaveCount(3);
});
