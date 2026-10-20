import { describe, expect, it } from "vitest";
import siteUrlModule from "../lib/site-url.cjs";
import { absoluteUrl, resolveReturnOrigin } from "../lib/site.js";

const { resolveSiteUrl, FALLBACK_SITE_URL } = siteUrlModule;

describe("resolveSiteUrl", () => {
  it("falls back to the eon-ht82 deployment", () => {
    expect(resolveSiteUrl({})).toBe("https://eon-ht82.vercel.app");
    expect(FALLBACK_SITE_URL).toBe("https://eon-ht82.vercel.app");
  });

  it("prefers NEXT_PUBLIC_SITE_URL and drops any trailing slash or path", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://shop.example.nz/",
        VERCEL_PROJECT_PRODUCTION_URL: "eon-ht82.vercel.app",
      }),
    ).toBe("https://shop.example.nz");
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: " https://a.example/x " }),
    ).toBe("https://a.example");
  });

  it("uses Vercel's production URL when no site URL is set", () => {
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "eon-ht82.vercel.app" }),
    ).toBe("https://eon-ht82.vercel.app");
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "other-eon.vercel.app" }),
    ).toBe("https://other-eon.vercel.app");
  });

  it("ignores blank or invalid values", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "   ",
        VERCEL_PROJECT_PRODUCTION_URL: "",
      }),
    ).toBe(FALLBACK_SITE_URL);
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" }),
    ).toBe(FALLBACK_SITE_URL);
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a url" })).toBe(
      FALLBACK_SITE_URL,
    );
  });
});

describe("absoluteUrl", () => {
  it("joins paths onto the site URL", () => {
    expect(absoluteUrl("/shop/love")).toBe(`${FALLBACK_SITE_URL}/shop/love`);
    expect(absoluteUrl("cart")).toBe(`${FALLBACK_SITE_URL}/cart`);
  });
});

describe("resolveReturnOrigin", () => {
  const site = "https://eon-ht82.vercel.app";
  const req = (host, extra = {}) => ({ headers: { host, ...extra } });

  it("rejects hosts that are not on the allow-list", () => {
    expect(resolveReturnOrigin(req("evil.example"), { env: {}, site })).toBe(
      site,
    );
  });

  it("ignores a spoofed Origin header", () => {
    expect(
      resolveReturnOrigin(
        req("eon-ht82.vercel.app", { origin: "https://evil.example" }),
        { env: {}, site },
      ),
    ).toBe(site);
  });

  it("accepts loopback hosts outside Vercel production", () => {
    expect(resolveReturnOrigin(req("127.0.0.1:7301"), { env: {}, site })).toBe(
      "http://127.0.0.1:7301",
    );
    expect(resolveReturnOrigin(req("localhost:3000"), { env: {}, site })).toBe(
      "http://localhost:3000",
    );
  });

  it("refuses loopback hosts in Vercel production", () => {
    expect(
      resolveReturnOrigin(req("127.0.0.1:7301"), {
        env: { VERCEL_ENV: "production" },
        site,
      }),
    ).toBe(site);
  });

  it("accepts this deployment's own Vercel URLs", () => {
    const env = {
      VERCEL_URL: "eon-abc123.vercel.app",
      VERCEL_BRANCH_URL: "eon-git-improve.vercel.app",
    };
    expect(
      resolveReturnOrigin(req("eon-abc123.vercel.app"), { env, site }),
    ).toBe("https://eon-abc123.vercel.app");
    expect(
      resolveReturnOrigin(req("eon-git-improve.vercel.app"), { env, site }),
    ).toBe("https://eon-git-improve.vercel.app");
  });

  it("falls back to the site URL when there is no Host header", () => {
    expect(resolveReturnOrigin({ headers: {} }, { env: {}, site })).toBe(site);
    expect(resolveReturnOrigin(undefined, { env: {}, site })).toBe(site);
  });
});
