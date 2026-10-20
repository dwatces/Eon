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

const routes = ["/", "/shop", "/shop/love", "/about", "/success", "/cart"];

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

// Card positions on /shop: [top of each card, top of each name].
const shopGrid = (page) =>
  page.locator("main ul > li").evaluateAll((items) =>
    items.map((li) => ({
      top: Math.round(li.getBoundingClientRect().top),
      left: Math.round(li.getBoundingClientRect().left),
      name: li.querySelector("h2").getBoundingClientRect().top,
    })),
  );

const shopLayouts = [
  { width: 1440, columns: 4 },
  { width: 768, columns: 2 },
  { width: 320, columns: 1 },
];

for (const { width, columns } of shopLayouts) {
  test.describe(`/shop at ${width} px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test(`shows ${columns} per row with the names lined up`, async ({
      page,
    }) => {
      await page.goto("/shop");
      await page.waitForLoadState("networkidle");
      const cards = await shopGrid(page);
      expect(cards).toHaveLength(4);
      const firstRow = cards.filter((card) => card.top === cards[0].top);
      expect(firstRow).toHaveLength(columns);
      const names = firstRow.map((card) => card.name);
      expect(Math.max(...names) - Math.min(...names)).toBeLessThanOrEqual(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
    });
  });
}

test("a product page reads h1, h2, h3 with no gap under the title", async ({
  page,
}) => {
  await page.goto("/shop/love");
  const outline = await page
    .locator("main")
    .locator("h1, h2, h3")
    .evaluateAll((hs) => hs.map((h) => h.tagName));
  expect(outline).toEqual(["H1", "H2", "H3", "H3", "H3"]);
  await expect(
    page.getByRole("region", { name: "More candles" }).getByRole("link"),
  ).toHaveText(["Happiness", "Dreams", "Summer"]);
  const gap = await page.evaluate(() => {
    const title = document.querySelector("main h1").getBoundingClientRect();
    const next = document.querySelector("main h1 + p").getBoundingClientRect();
    return next.top - title.bottom;
  });
  expect(gap).toBeLessThan(80);
});

test.describe("product page at 1440 px", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the photos and the details start at the same height", async ({
    page,
  }) => {
    await page.goto("/shop/dreams");
    const tops = await page.evaluate(() => ({
      gallery: document
        .querySelector("main [aria-label='View larger photo']")
        .closest("div[class*=stage]")
        .getBoundingClientRect().top,
      title: document.querySelector("main h1").getBoundingClientRect().top,
    }));
    expect(Math.abs(tops.gallery - tops.title)).toBeLessThan(24);
  });
});

test("the footer has text links and a labelled Facebook link", async ({
  page,
}) => {
  await page.goto("/about");
  const footer = page.locator("footer");
  await expect(
    footer.getByRole("navigation", { name: "Footer" }).getByRole("link"),
  ).toHaveText(["Home", "Shop", "About"]);
  const facebook = footer.getByRole("link", {
    name: "Eon Candles on Facebook (opens in a new tab)",
  });
  await expect(facebook).toHaveAttribute("target", "_blank");
  await expect(facebook).toHaveAttribute("rel", "noopener noreferrer");
  const box = await facebook.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test.describe("short pages at 1440×900", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test.use({ allowedConsole: [/status of 404/] });

  for (const path of ["/success", "/cart", "/nope"]) {
    test(`the footer sits at the bottom of ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const bottom = await page
        .locator("footer")
        .evaluate((el) => el.getBoundingClientRect().bottom);
      expect(Math.abs(bottom - 900)).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("the 16px gutter at 390 px", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.use({ allowedConsole: [/status of 404/] });

  const paths = ["/", "/shop", "/shop/love", "/about", "/cart", "/nope"];
  for (const path of paths) {
    test(`no text or control on ${path} is within 16px of the edge`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const close = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const found = [];
        for (const el of document.querySelectorAll("body *")) {
          const control = el.matches("a[href], button, input, select");
          const text = [...el.childNodes].some(
            (node) => node.nodeType === 3 && node.textContent.trim(),
          );
          if (!control && !text) continue;
          const rect = el.getBoundingClientRect();
          if (rect.width <= 1 || rect.height <= 1 || rect.bottom <= 0) continue;
          if (rect.left < 15.5 || rect.right > width - 15.5) {
            found.push(
              `${el.tagName} ${Math.round(rect.left)}-${Math.round(rect.right)}`,
            );
          }
        }
        return found;
      });
      expect(close).toEqual([]);
    });
  }
});

test.describe("home page at 390 px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the banner shows the tins at least 200px tall", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator("header img").boundingBox();
    expect(box.width).toBe(390);
    expect(box.height).toBeGreaterThanOrEqual(200);
  });
});

test("every in-page link on the home page has a target", async ({ page }) => {
  await page.goto("/");
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute("href").slice(1))
      .filter((id) => !document.getElementById(id)),
  );
  expect(missing).toEqual([]);
  // Energy, Oneness and Nature are headings of their own stories.
  await expect(page.locator("main section h2")).toHaveText([
    "Energy",
    "Oneness",
    "Nature",
    "Our candles",
  ]);
});

test("the About page has one heading, plain sections and no line breaks", async ({
  page,
}) => {
  await page.goto("/about");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 1 })).toHaveText("About Eon");
  await expect(main.getByRole("heading", { level: 2 })).toHaveText([
    "Packaging",
    "Contact",
  ]);
  await expect(main.locator("h1 a, h2 a")).toHaveCount(0);
  await expect(main.locator("br")).toHaveCount(0);
  await expect(main.locator("#contact")).toContainText("no orders");
});
