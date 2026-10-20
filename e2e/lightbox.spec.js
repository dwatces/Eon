import { test, expect } from "./fixtures";

const dialog = (page) =>
  page.getByRole("dialog", { name: "Love candle photos" });

test.describe("product photo lightbox", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/shop/love");
  });

  test("a thumbnail opens its own photo", async ({ page }) => {
    // Thumbnails show the flower, lit and crystal photos (images 2 to 4).
    await page
      .getByRole("button", { name: "Love candle with rose quartz crystals" })
      .click();
    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toContainText("Image 4 of 4");
    await expect(dialog(page).getByRole("img")).toHaveAttribute(
      "alt",
      "Love candle with rose quartz crystals",
    );
  });

  test("Previous and Next wrap around", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Love candle in a gold tin, lid propped open",
      })
      .click();
    await expect(dialog(page)).toContainText("Image 1 of 4");
    await dialog(page).getByRole("button", { name: "Previous image" }).click();
    await expect(dialog(page)).toContainText("Image 4 of 4");
    await dialog(page).getByRole("button", { name: "Next image" }).click();
    await expect(dialog(page)).toContainText("Image 1 of 4");
  });

  test("arrow keys move between photos", async ({ page }) => {
    await page
      .getByRole("button", { name: "Love candle with red carnations" })
      .click();
    await expect(dialog(page)).toContainText("Image 2 of 4");
    await page.keyboard.press("ArrowRight");
    await expect(dialog(page)).toContainText("Image 3 of 4");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog(page)).toContainText("Image 1 of 4");
  });

  test("focus stays inside, and Escape closes and returns focus", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", {
      name: "Love candle lit, with the lid off",
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeVisible();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () => !!document.activeElement?.closest("dialog[open]"),
      );
      expect(inside).toBe(true);
    }
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Shift+Tab");
      const inside = await page.evaluate(
        () => !!document.activeElement?.closest("dialog[open]"),
      );
      expect(inside).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("the Close button closes it", async ({ page }) => {
    await page
      .getByRole("button", { name: "Love candle with red carnations" })
      .click();
    await dialog(page).getByRole("button", { name: "Close" }).click();
    await expect(dialog(page)).toBeHidden();
  });
});
