import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

// Automated accessibility checks: axe-core against WCAG 2.2 A and AA plus
// axe's best-practice rules, on every page and on the states that only
// appear after an interaction. Each test runs at 390 and 1440 px.

const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function axeViolations(page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(TAGS)
    .analyze();
  return violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes
        .slice(0, 5)
        .map((n) => n.target.join(" "))
        .join(", ")}`,
  );
}

const FULL_CART = JSON.stringify({ v: 2, lines: { love: 2, dreams: 1 } });

const seedCart = (page) =>
  page.addInitScript((value) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("eon-cart", value);
      sessionStorage.setItem("seeded", "1");
    }
  }, FULL_CART);

// Each page, and something on it that only shows once the page has
// hydrated, so axe never scores a loading state.
const pages = [
  ["/", "Our candles"],
  ["/shop", "Our candles"],
  ["/shop/love", "Love"],
  ["/shop/happiness", "Happiness"],
  ["/shop/dreams", "Dreams"],
  ["/shop/summer", "Summer"],
  ["/about", "About Eon"],
  ["/cart", "Your cart is empty."],
  ["/success", "There's no order to show here"],
];

test.describe("axe finds no WCAG 2.2 AA or best-practice problems", () => {
  for (const [path, ready] of pages) {
    test(`on ${path}, which has one h1 and is in NZ English`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator("main").getByText(ready).first()).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(await axeViolations(page)).toEqual([]);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-NZ");
    });
  }

  test.describe("on a missing page", () => {
    test.use({ allowedConsole: [/status of 404/] });

    test("/nope, which has one h1 and is in NZ English", async ({ page }) => {
      const response = await page.goto("/nope");
      expect(response.status()).toBe(404);
      await page.waitForLoadState("networkidle");
      expect(await axeViolations(page)).toEqual([]);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-NZ");
    });
  });

  test("on a full cart", async ({ page }) => {
    await seedCart(page);
    await page.goto("/cart");
    await expect(
      page.getByRole("region", { name: "Order summary" }),
    ).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test("on the demo order summary", async ({ page }) => {
    await seedCart(page);
    await page.goto("/cart");
    await page.getByRole("button", { name: /checkout/i }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Demo order summary",
    );
    expect(await axeViolations(page)).toEqual([]);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("with the lightbox open", async ({ page }) => {
    await page.goto("/shop/love");
    await page.getByRole("button", { name: "View larger photo" }).click();
    const dialog = page.getByRole("dialog", { name: "Love candle photos" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test("with the mobile menu open", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile",
      "the menu button only shows on small screens",
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(
      page.locator("#site-menu").getByRole("link", { name: "Shop" }),
    ).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });
});

// Anything drawn past the right or left edge of the viewport. Skips
// elements that are hidden, visually hidden (1px), above the page (the
// skip link before it gets focus) or clipped by a scrolling or clipping
// ancestor that itself fits.
const offscreen = (page) =>
  page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const clippedByAncestor = (el) => {
      for (
        let p = el.parentElement;
        p && p !== document.body;
        p = p.parentElement
      ) {
        const { overflowX } = getComputedStyle(p);
        if (overflowX !== "visible") {
          const r = p.getBoundingClientRect();
          return r.left >= -0.5 && r.right <= width + 0.5;
        }
      }
      return false;
    };
    const found = [];
    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1 || rect.bottom <= 0) continue;
      if (rect.right <= width + 0.5 && rect.left >= -0.5) continue;
      if (clippedByAncestor(el)) continue;
      const name = el.id ? `#${el.id}` : el.className || el.tagName;
      found.push(
        `${el.tagName} ${String(name).slice(0, 40)} ${Math.round(rect.left)}-${Math.round(rect.right)}`,
      );
    }
    if (document.documentElement.scrollWidth > width) {
      found.push(
        `page scrolls sideways: ${document.documentElement.scrollWidth}px`,
      );
    }
    return found;
  });

// Text cut off by its own box: an element with overflow hidden whose
// content is wider or taller than the box.
const clippedText = (page) =>
  page.evaluate(() => {
    const found = [];
    for (const el of document.querySelectorAll("body *")) {
      const hasText = [...el.childNodes].some(
        (node) => node.nodeType === 3 && node.textContent.trim(),
      );
      if (!hasText) continue;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) continue;
      const clipsX = style.overflowX !== "visible";
      const clipsY = style.overflowY !== "visible";
      if (
        (clipsX && el.scrollWidth > el.clientWidth + 1) ||
        (clipsY && el.scrollHeight > el.clientHeight + 1)
      ) {
        found.push(`${el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
      }
    }
    return found;
  });

const reflowPaths = [
  "/",
  "/shop",
  "/shop/love",
  "/about",
  "/cart",
  "/success",
  "/nope",
];

test.describe("at 320 px wide (WCAG 1.4.10 reflow)", () => {
  test.use({
    viewport: { width: 320, height: 640 },
    allowedConsole: [/status of 404/],
  });
  // One fixed viewport, so these run in one project only.
  test.beforeEach(() => {
    test.skip(test.info().project.name !== "mobile");
  });

  for (const path of reflowPaths) {
    test(`nothing on ${path} runs off the screen`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(await offscreen(page)).toEqual([]);
    });
  }

  test("nothing in a full cart runs off the screen", async ({ page }) => {
    await seedCart(page);
    await page.goto("/cart");
    await expect(
      page.getByRole("region", { name: "Order summary" }),
    ).toBeVisible();
    expect(await offscreen(page)).toEqual([]);
  });

  test("nothing in the open menu runs off the screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(
      page.locator("#site-menu").getByRole("link", { name: "Shop" }),
    ).toBeVisible();
    expect(await offscreen(page)).toEqual([]);
  });
});

test.describe("with text at 200% (WCAG 1.4.4 resize text)", () => {
  test.use({
    viewport: { width: 1280, height: 800 },
    allowedConsole: [/status of 404/],
  });
  // One fixed viewport, so these run in one project only.
  test.beforeEach(() => {
    test.skip(test.info().project.name !== "desktop");
  });

  // The browser's own font size setting, doubled from 16px to 32px, as a
  // reader would set it. Every font size on the site is in rem.
  test.beforeEach(async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Page.setFontSizes", {
      fontSizes: { standard: 32, fixed: 26 },
    });
  });

  for (const path of [...reflowPaths, "/shop/summer"]) {
    test(`nothing on ${path} is cut off or runs off the screen`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const rootSize = await page.evaluate(
        () => getComputedStyle(document.documentElement).fontSize,
      );
      expect(rootSize).toBe("32px");
      expect(await offscreen(page)).toEqual([]);
      expect(await clippedText(page)).toEqual([]);
    });
  }

  test("nothing in a full cart is cut off", async ({ page }) => {
    await seedCart(page);
    await page.goto("/cart");
    await expect(
      page.getByRole("region", { name: "Order summary" }),
    ).toBeVisible();
    expect(await offscreen(page)).toEqual([]);
    expect(await clippedText(page)).toEqual([]);
  });
});
