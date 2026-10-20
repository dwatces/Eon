import { test, expect } from "./fixtures";

const focusedName = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return (el?.getAttribute("aria-label") || el?.textContent || "").trim();
  });

// Presses Tab until the focused element's name matches, up to a limit.
async function tabTo(page, name, limit = 30) {
  const names = [];
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const current = await focusedName(page);
    names.push(current);
    if (current === name) return names;
  }
  throw new Error(`Never reached "${name}": ${names.join(" | ")}`);
}

test("the skip link is the first tab stop and jumps to the content", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.keyboard.press("Tab");
  expect(await focusedName(page)).toBe("Love");
});

for (const path of ["/shop", "/"]) {
  test(`Tab reaches the four candles in order on ${path}, and Enter opens one`, async ({
    page,
  }) => {
    await page.goto(path);
    const names = await tabTo(page, "Summer");
    const candles = names.filter((name) =>
      ["Love", "Happiness", "Dreams", "Summer"].includes(name),
    );
    expect(candles).toEqual(["Love", "Happiness", "Dreams", "Summer"]);
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    expect(await focusedName(page)).toBe("Love");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/shop\/love$/);
  });
}

test("there is one element named cart on the shop page", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("link", { name: /cart/i })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /cart/i })).toHaveCount(0);
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const toggle = (page) => page.getByRole("button", { name: "Menu" });
  const menu = (page) => page.locator("#site-menu");

  test("opening it moves focus to the first link", async ({ page }) => {
    await page.goto("/about");
    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
    await expect(menu(page).getByRole("link", { name: "Home" })).toBeFocused();
  });

  test("Escape closes it and puts focus back on the toggle", async ({
    page,
  }) => {
    await page.goto("/about");
    await toggle(page).click();
    await expect(menu(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(toggle(page)).toBeFocused();
  });

  test("a tap outside closes it without following a link", async ({ page }) => {
    await page.goto("/shop");
    await toggle(page).click();
    await expect(menu(page)).toBeVisible();
    // The Love card sits under this point; the tap must not open it.
    await page.mouse.click(60, 400);
    await expect(menu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("the logo goes home with the menu closed", async ({ page }) => {
    await page.goto("/about");
    await toggle(page).click();
    await page.getByRole("link", { name: "Eon home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(menu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("Back closes it too", async ({ page }) => {
    await page.goto("/about");
    await page.goto("/shop");
    await toggle(page).click();
    await expect(menu(page)).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/about$/);
    await expect(menu(page)).toBeHidden();
  });
});
