import { test as base, expect } from "@playwright/test";

// Every test fails if the page logs a console error, throws, or sends a
// request anywhere other than the local server.
export const test = base.extend({
  pageErrors: [
    async ({ page, baseURL }, use) => {
      const errors = [];
      const allowedHost = new URL(baseURL).host;
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
      });
      page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
      page.on("request", (req) => {
        const url = new URL(req.url());
        if (/^(data|blob):/.test(url.protocol)) return;
        if (url.host !== allowedHost)
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
