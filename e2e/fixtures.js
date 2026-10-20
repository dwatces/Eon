import { test as base, expect } from "@playwright/test";

// Every test fails if the page logs a console error, throws, or sends a
// request anywhere other than the local server.
//
// stubbedHosts: hosts a test expects the page to visit, such as Stripe
// Checkout. Requests to them are answered here with a small local page,
// so they never leave the machine, and are not counted as failures.
export const test = base.extend({
  allowedConsole: [[], { option: true }],
  stubbedHosts: [[], { option: true }],
  pageErrors: [
    async ({ page, baseURL, allowedConsole, stubbedHosts }, use) => {
      const errors = [];
      const allowedHost = new URL(baseURL).host;
      for (const host of stubbedHosts) {
        await page.route(`https://${host}/**`, (route) =>
          route.fulfill({
            status: 200,
            contentType: "text/html",
            body: `<!doctype html><html lang="en"><title>${host} (local stub)</title><h1>${host} (local stub)</h1></html>`,
          }),
        );
      }
      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        const text = msg.text();
        if (allowedConsole.some((pattern) => pattern.test(text))) return;
        errors.push(`console: ${text}`);
      });
      page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
      page.on("request", (req) => {
        const url = new URL(req.url());
        if (url.protocol === "data:" || url.protocol === "blob:") return;
        if (url.host === allowedHost) return;
        if (url.protocol === "https:" && stubbedHosts.includes(url.host)) {
          return;
        }
        errors.push(`external request: ${url.host}`);
      });
      await use(errors);
      expect(
        errors,
        "console errors, page errors or external requests",
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
