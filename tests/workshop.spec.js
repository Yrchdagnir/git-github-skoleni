import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("starts in Czech with preparation and the first Git lesson available", async ({ page }) => {
  await page.goto("/workshop/");

  await expect(page).toHaveTitle("Průvodce školením | Git a GitHub");
  await expect(page.getByRole("heading", { name: "Nástroje pro dílnu" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Založ vlastní dílnu/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Od změny ke commitu/ })).toBeDisabled();
});

test("valid unlock links reveal their step and all previous steps", async ({ page }) => {
  await page.goto("/workshop/?unlock=github-pr");

  await expect(page).toHaveURL(/\/workshop\/$/);
  await expect(page.getByRole("heading", { name: "Otevři pull request" })).toBeVisible();
  await expect(page.getByText("Odemčeno: Otevři pull request")).toBeVisible();
  await expect(page.getByRole("button", { name: /Přidej vlastní lektvar/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Review je rozhovor o změně/ })).toBeDisabled();

  await page.reload();
  await expect(page.getByRole("button", { name: /Otevři pull request/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Review je rozhovor o změně/ })).toBeDisabled();
});

test("invalid unlock links leave progress unchanged", async ({ page }) => {
  await page.goto("/workshop/?unlock=neexistujici-krok");

  await expect(page).toHaveURL(/\/workshop\/$/);
  await expect(page.getByRole("button", { name: /Založ vlastní dílnu/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Od změny ke commitu/ })).toBeDisabled();
  await expect(page.locator("#unlock-notice")).toBeHidden();
});

test("completed steps and language survive reload independently", async ({ page }) => {
  await page.goto("/workshop/");
  await page.getByLabel("Tomuto kroku rozumím").check();
  await page.getByRole("button", { name: "Slovenčina" }).click();
  await page.reload();

  await expect(page).toHaveTitle("Sprievodca školením | Git a GitHub");
  await expect(page.getByRole("heading", { name: "Nástroje pre dielňu" })).toBeVisible();
  await expect(page.getByLabel("Tomuto kroku rozumiem")).toBeChecked();
  await expect(page.locator("#progress-value")).toHaveText("1 / 23");
});

test("the Slovak version covers the entire guide", async ({ page }) => {
  await page.goto("/workshop/?unlock=actions-release-pages");
  await page.getByRole("button", { name: "Slovenčina" }).click();

  await expect(page.getByRole("heading", { name: "Od merge k release a webu" })).toBeVisible();
  await expect(page.getByText("Praktická úloha", { exact: true })).toBeVisible();
  await expect(page.getByText("Očakávaný výsledok", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Čo je GitHub Actions/ }).click();
  await expect(page.getByText("Ktorá časť workflow rozhoduje, kedy sa automatizácia spustí?")).toBeVisible();
  await page.getByRole("button", { name: /Pridaj vlastný elixír/ }).click();
  await expect(page.getByText("Recept iba v slovenčine sa v češtine nezobrazí.")).toBeVisible();
});

test("reset requires confirmation and restores the default locks", async ({ page }) => {
  await page.goto("/workshop/?unlock=github-pr");
  await page.getByLabel("Tomuto kroku rozumím").check();
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("button", { name: "Resetovat postup" }).click();
  await expect(page.getByRole("heading", { name: "Otevři pull request" })).toBeVisible();

  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Resetovat postup" }).click();
  await expect(page.getByRole("heading", { name: "Nástroje pro dílnu" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Od změny ke commitu/ })).toBeDisabled();
  await expect(page.locator("#progress-value")).toHaveText("0 / 23");
});

test("cheat sheet searches and copies commands", async ({ page }) => {
  await page.addInitScript(() => {
    window.__copiedCommand = "";
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async value => { window.__copiedCommand = value; } },
      configurable: true
    });
  });
  await page.goto("/workshop/");
  await page.locator("#cheatsheet-search").fill("force");

  await expect(page.getByText("Může přepsat sdílenou historii. Na workshopu nepoužívat.")).toBeVisible();
  const command = page.locator(".cheat-command").filter({ hasText: "git push --force" });
  await command.getByRole("button", { name: "Kopírovat příkaz" }).click();
  await expect.poll(() => page.evaluate(() => window.__copiedCommand)).toBe("git push --force");
  await expect(page.locator("#toast")).toHaveText("Příkaz zkopírován");
});

test("facilitator panel creates a working unlock link", async ({ page }) => {
  await page.addInitScript(() => {
    window.__copiedUnlock = "";
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async value => { window.__copiedUnlock = value; } },
      configurable: true
    });
  });
  await page.goto("/workshop/facilitator.html");
  const row = page.locator('[data-step-id="actions-failure"]');
  await expect(row).toContainText("Rozbij, přečti, oprav");
  await row.getByRole("button", { name: "Kopírovat odkaz" }).click();
  await expect(page.locator("#toast")).toHaveText("Odemykací odkaz zkopírován");

  const copiedUrl = await page.evaluate(() => window.__copiedUnlock);
  expect(copiedUrl).toContain("/workshop/?unlock=actions-failure");
  await page.goto(copiedUrl);
  await expect(page.getByRole("heading", { name: "Rozbij, přečti, oprav" })).toBeVisible();
});

test("primary controls can be reached and used from the keyboard", async ({ page }) => {
  await page.goto("/workshop/");
  await page.getByRole("button", { name: "Slovenčina" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveTitle("Sprievodca školením | Git a GitHub");

  const lessonButton = page.getByRole("button", { name: /Založ vlastnú dielňu/ });
  await lessonButton.focus();
  await expect(lessonButton).toBeFocused();
  expect(await lessonButton.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Založ vlastnú dielňu" })).toBeVisible();
});

test("mobile navigation and cheat sheet fit without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/workshop/?unlock=actions-release-pages");

  await expect(page.getByRole("heading", { name: "Od merge k release a webu" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("tab", { name: "Tahák" }).click();
  await expect(page.getByRole("heading", { name: "Git tahák" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("tab", { name: "Kapitola" }).click();
  await expect(page.getByRole("heading", { name: "Od merge k release a webu" })).toBeVisible();
});

test("archive links to the guide in both languages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Průvodce školením" })).toHaveAttribute("href", "workshop/");
  await page.getByRole("button", { name: "Slovenčina" }).click();
  await expect(page.getByRole("link", { name: "Sprievodca školením" })).toBeVisible();
});
