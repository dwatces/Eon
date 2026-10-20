import { describe, expect, it } from "vitest";
import nextConfig from "../next.config.js";

describe("next.config.js security headers", () => {
  it("sends the baseline security headers on every route", async () => {
    const rules = await nextConfig.headers();
    const all = rules.find((rule) => rule.source === "/:path*");
    const names = all.headers.map((header) => header.key);
    expect(names).toEqual(
      expect.arrayContaining([
        "X-Content-Type-Options",
        "Strict-Transport-Security",
        "X-Frame-Options",
      ]),
    );
  });
});
