import { test, expect } from "./fixtures";

const dialog = (page) =>
  page.getByRole("dialog", { name: "Love candle photos" });

const mainPhoto = (page) =>
  page.getByRole("button", { name: "View larger photo" }).locator("img");

const thumbnail = (page, name) =>
  page
    .getByRole("list", { name: "Love candle photos" })
    .getByRole("button", { name });

test.describe("product gallery on wide screens", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/shop/love");
  });

  test("a thumbnail changes the main photo and is marked as pressed", async ({
    page,
  }) => {
    const lid = thumbnail(page, "Love candle in a gold tin, lid propped open");
    const lit = thumbnail(page, "Love candle lit, with the lid off");
    await expect(lid).toHaveAttribute("aria-pressed", "true");
    await expect(lit).toHaveAttribute("aria-pressed", "false");

    await lit.click();
    await expect(mainPhoto(page)).toHaveAttribute(
      "alt",
      "Love candle lit, with the lid off",
    );
    await expect(mainPhoto(page)).toHaveAttribute("src", /lit-love/);
    await expect(lit).toHaveAttribute("aria-pressed", "true");
    await expect(lid).toHaveAttribute("aria-pressed", "false");
  });

  test("the main photo opens the lightbox at the photo on screen", async ({
    page,
  }) => {
    await thumbnail(page, "Love candle lit, with the lid off").click();
    await page.getByRole("button", { name: "View larger photo" }).click();
    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toContainText("Image 3 of 4");
    await expect(dialog(page).getByRole("img")).toHaveAttribute(
      "alt",
      "Love candle lit, with the lid off",
    );
  });

  test("Previous and Next wrap around", async ({ page }) => {
    await page.getByRole("button", { name: "View larger photo" }).click();
    await expect(dialog(page)).toContainText("Image 1 of 4");
    await dialog(page).getByRole("button", { name: "Previous image" }).click();
    await expect(dialog(page)).toContainText("Image 4 of 4");
    await dialog(page).getByRole("button", { name: "Next image" }).click();
    await expect(dialog(page)).toContainText("Image 1 of 4");
  });

  test("arrow keys move between photos", async ({ page }) => {
    await thumbnail(page, "Love candle with red carnations").click();
    await page.getByRole("button", { name: "View larger photo" }).click();
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
    const trigger = page.getByRole("button", { name: "View larger photo" });
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
    await page.getByRole("button", { name: "View larger photo" }).click();
    await dialog(page).getByRole("button", { name: "Close" }).click();
    await expect(dialog(page)).toBeHidden();
  });

  test("lightbox photos are sent as small images", async ({ page }) => {
    const sizes = [];
    page.on("response", async (response) => {
      if (!response.url().includes("/_next/image")) return;
      const body = await response.body().catch(() => null);
      if (body) sizes.push({ url: response.url(), bytes: body.length });
    });
    await page.getByRole("button", { name: "View larger photo" }).click();
    for (let i = 1; i <= 4; i++) {
      await expect(dialog(page)).toContainText(`Image ${i} of 4`);
      await expect(dialog(page).getByRole("img")).toHaveJSProperty(
        "complete",
        true,
      );
      await page.keyboard.press("ArrowRight");
    }
    expect(sizes.length).toBeGreaterThan(0);
    for (const { url, bytes } of sizes) {
      expect(bytes, url).toBeLessThan(250_000);
    }
  });
});

test.describe("product gallery on small screens", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Previous and Next change the main photo and wrap around", async ({
    page,
  }) => {
    await page.goto("/shop/love");
    const previous = page.getByRole("button", { name: "Previous photo" });
    const next = page.getByRole("button", { name: "Next photo" });
    for (const button of [previous, next]) {
      const box = await button.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await expect(page.getByText("Photo 1 of 4")).toBeVisible();
    await previous.click();
    await expect(page.getByText("Photo 4 of 4")).toBeVisible();
    await expect(mainPhoto(page)).toHaveAttribute(
      "alt",
      "Love candle with rose quartz crystals",
    );
    await next.click();
    await expect(page.getByText("Photo 1 of 4")).toBeVisible();
    await next.click();
    await expect(mainPhoto(page)).toHaveAttribute(
      "alt",
      "Love candle with red carnations",
    );
  });

  test("the arrows can be reached with Tab", async ({ page }) => {
    await page.goto("/shop/love");
    const names = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      names.push(
        await page.evaluate(
          () =>
            document.activeElement?.getAttribute("aria-label") ||
            document.activeElement?.textContent.trim(),
        ),
      );
    }
    expect(names).toContain("Previous photo");
    expect(names).toContain("Next photo");
  });
});
