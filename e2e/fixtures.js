import { test as base, expect } from "@playwright/test";

// Google Fonts still loads from Google until the fonts are self-hosted.
const ALLOWED_EXTERNAL_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

// Every test fails if the page logs a console error, throws, or sends a
// request anywhere other than the local server.
export const test = base.extend({
  allowedConsole: [[], { option: true }],
  pageErrors: [
    async ({ page, baseURL, allowedConsole }, use) => {
      const errors = [];
      const allowedHost = new URL(baseURL).host;
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
        if (ALLOWED_EXTERNAL_HOSTS.includes(url.hostname)) return;
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
