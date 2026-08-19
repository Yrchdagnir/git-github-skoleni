import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("starts in Czech with every lesson available", async ({ page }) => {
  await page.goto("/workshop/");

  await expect(page).toHaveTitle("Průvodce školením | Git a GitHub");
  await expect(page.getByRole("heading", { name: "Nástroje pro dílnu" })).toBeVisible();
  await expect(page.locator(".step-link:not([disabled])")).toHaveCount(23);
  await expect(page.locator(".step-link[disabled]")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Od merge k release a webu/ })).toBeEnabled();
});

test("legacy unlock links are cleaned up without changing the open guide", async ({ page }) => {
  await page.goto("/workshop/?unlock=github-pr");

  await expect(page).toHaveURL(/\/workshop\/$/);
  await expect(page.getByRole("heading", { name: "Nástroje pro dílnu" })).toBeVisible();
  await expect(page.locator(".step-link:not([disabled])")).toHaveCount(23);
});

test("lesson hashes open a specific lesson directly", async ({ page }) => {
  await page.goto("/workshop/#github-pr");

  await expect(page).toHaveURL(/\/workshop\/#github-pr$/);
  await expect(page.getByRole("heading", { name: "Otevři pull request" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Review je rozhovor o změně/ })).toBeEnabled();
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
  await page.goto("/workshop/#actions-release-pages");
  await page.getByRole("button", { name: "Slovenčina" }).click();

  await expect(page.getByRole("heading", { name: "Od merge k release a webu" })).toBeVisible();
  await expect(page.getByText("Praktická úloha", { exact: true })).toBeVisible();
  await expect(page.getByText("Očakávaný výsledok", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Čo je GitHub Actions/ }).click();
  await expect(page.getByText("Ktorá časť workflow rozhoduje, kedy sa automatizácia spustí?")).toBeVisible();
  await page.getByRole("button", { name: /Pridaj vlastný elixír/ }).click();
  await expect(page.getByText("Recept iba v slovenčine sa v češtine nezobrazí.")).toBeVisible();
});

test("reset requires confirmation and clears only completed steps", async ({ page }) => {
  await page.goto("/workshop/#github-pr");
  await page.getByLabel("Tomuto kroku rozumím").check();
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("button", { name: "Resetovat postup" }).click();
  await expect(page.getByRole("heading", { name: "Otevři pull request" })).toBeVisible();

  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Resetovat postup" }).click();
  await expect(page.getByRole("heading", { name: "Nástroje pro dílnu" })).toBeVisible();
  await expect(page.locator(".step-link:not([disabled])")).toHaveCount(23);
  await expect(page.locator(".step-link[disabled]")).toHaveCount(0);
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

test("facilitator notes cover lessons and link back to the guide", async ({ page }) => {
  await page.goto("/workshop/facilitator.html");
  await expect(page).toHaveTitle("Facilitátorské poznámky | Git a GitHub");
  await expect(page.locator(".lesson-note")).toHaveCount(23);
  const note = page.locator('[data-step-id="actions-failure"]');
  await note.locator("summary").click();
  await expect(note.getByRole("heading", { name: "Hlavní myšlenka" })).toBeVisible();
  await expect(note.getByRole("heading", { name: "Aktivita účastníků" })).toBeVisible();
  await expect(note.getByRole("heading", { name: "Debrief" })).toBeVisible();
  const lessonLink = note.getByRole("link", { name: "Otevřít lekci v průvodci" });
  await expect(lessonLink).toHaveAttribute("href", "./#actions-failure");
  await lessonLink.click();
  await expect(page.getByRole("heading", { name: "Rozbij, přečti, oprav" })).toBeVisible();
});

test("facilitator notes can be searched and expanded", async ({ page }) => {
  await page.goto("/workshop/facilitator.html");
  await page.locator("#notes-search").fill("slice(0, 1)");
  await expect(page.locator(".lesson-note")).toHaveCount(1);
  await expect(page.locator('[data-step-id="actions-failure"]')).toBeVisible();
  await page.getByRole("button", { name: "Sbalit vše" }).click();
  await expect(page.locator('[data-step-id="actions-failure"]')).not.toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Rozbalit vše" }).click();
  await expect(page.locator('[data-step-id="actions-failure"]')).toHaveAttribute("open", "");
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
  await page.goto("/workshop/#actions-release-pages");

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
