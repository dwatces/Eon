import { describe, expect, it } from "vitest";
import nextConfig from "../next.config.js";

const headersFor = async (source) => {
  const rules = await nextConfig.headers();
  const rule = rules.find((entry) => entry.source === source);
  return Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]));
};

describe("next.config.js", () => {
  it("sends the security headers on every route", async () => {
    const headers = await headersFor("/:path*");
    expect(Object.keys(headers)).toEqual(
      expect.arrayContaining([
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Content-Security-Policy",
      ]),
    );
    expect(headers).not.toHaveProperty("X-XSS-Protection");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
  });

  it("allows scripts, fonts and connections from the site itself only", async () => {
    const csp = (await headersFor("/:path*"))["Content-Security-Policy"];
    const directives = Object.fromEntries(
      csp.split(";").map((part) => {
        const [name, ...values] = part.trim().split(/\s+/);
        return [name, values];
      }),
    );
    expect(directives["script-src"]).toEqual(["'self'"]);
    expect(directives["default-src"]).toEqual(["'self'"]);
    expect(directives["font-src"]).toEqual(["'self'"]);
    expect(directives["connect-src"]).toEqual(["'self'"]);
    expect(directives["object-src"]).toEqual(["'none'"]);
    expect(directives["frame-ancestors"]).toEqual(["'self'"]);
  });

  it("lists only permissions Chrome recognises", async () => {
    const policy = (await headersFor("/:path*"))["Permissions-Policy"];
    expect(policy).toBe("camera=(), microphone=(), geolocation=()");
  });

  it("never caches API responses", async () => {
    expect((await headersFor("/api/:path*"))["Cache-Control"]).toBe("no-store");
  });

  it("hides the X-Powered-By header and turns on strict mode", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.reactStrictMode).toBe(true);
  });
});
