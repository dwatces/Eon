import { test, expect } from "./fixtures";

// Layout and interaction checks from the design pass: 44px targets,
// reduced motion, visible focus and the page frame.

const CART = JSON.stringify({ v: 2, lines: { love: 2, dreams: 1 } });

const seedCart = (page) =>
  page.addInitScript((value) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("eon-cart", value);
      sessionStorage.setItem("seeded", "1");
    }
  }, CART);

// Every visible link, button and form control smaller than 44×44 CSS px.
// Exempt, as WCAG 2.5.8 allows: links inside a sentence. A card whose
// name link is stretched over the whole card is measured as the card.
const smallTargets = (page) =>
  page.evaluate(() => {
    const small = [];
    const selector = "a[href], button, input, select, textarea, summary";
    for (const el of document.querySelectorAll(selector)) {
      if (el.classList.contains("skip-link")) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;
      let rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (style.display === "inline" && el.closest("p")) continue;
      const after = getComputedStyle(el, "::after");
      if (after.position === "absolute" && after.content !== "none") {
        rect = el.offsetParent.getBoundingClientRect();
      }
      if (rect.width < 43.5 || rect.height < 43.5) {
        const name = (el.getAttribute("aria-label") || el.textContent).trim();
        small.push(
          `${el.tagName} "${name.slice(0, 40)}" ${rect.width}x${rect.height}`,
        );
      }
    }
    return small;
  });

const routes = ["/shop", "/shop/love", "/success", "/cart"];

for (const path of routes) {
  test(`every target on ${path} is at least 44×44`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await smallTargets(page)).toEqual([]);
  });
}

test("every target in a full cart is at least 44×44", async ({ page }) => {
  await seedCart(page);
  await page.goto("/cart");
  await expect(
    page.getByRole("region", { name: "Order summary" }),
  ).toBeVisible();
  expect(await smallTargets(page)).toEqual([]);
});

test.describe("at 390 px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the open menu's links are at least 44×44", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.locator("#site-menu")).toBeVisible();
    expect(await smallTargets(page)).toEqual([]);
  });
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("there is no smooth scrolling and no card transition", async ({
    page,
  }) => {
    await page.goto("/shop");
    const motion = await page.evaluate(() => {
      const card = document.querySelector("main article");
      return {
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
        transition: getComputedStyle(card).transitionDuration,
      };
    });
    expect(motion.scroll).toBe("auto");
    expect(motion.transition.split(",").map((d) => d.trim())).toEqual(
      expect.arrayContaining(["0s"]),
    );
    expect(motion.transition).not.toMatch(/[1-9]/);
  });
});

test("without a motion preference, in-page links scroll smoothly", async ({
  page,
}) => {
  await page.goto("/shop");
  const scroll = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );
  expect(scroll).toBe("smooth");
});

test("a focused card shows a focus ring", async ({ page }) => {
  await page.goto("/shop");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter"); // skip link
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => {
    const card = document.activeElement.closest("article");
    const style = getComputedStyle(card);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(ring.style).toBe("solid");
  expect(parseFloat(ring.width)).toBeGreaterThanOrEqual(2);
});

test("images have descriptive alt text or none", async ({ page }) => {
  for (const path of ["/", "/shop", "/shop/summer", "/about", "/cart"]) {
    await page.goto(path);
    const alts = await page
      .locator("img")
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("alt")));
    for (const alt of alts) {
      expect(alt, `an image on ${path} has no alt attribute`).not.toBeNull();
      expect(alt, `alt text on ${path}`).not.toMatch(
        /^\s|main$|topdown|banner|desktop|icon$/i,
      );
    }
  }
});
