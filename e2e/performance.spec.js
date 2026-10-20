import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { test, expect } from "./fixtures";

// Performance budgets on an emulated phone (390×844 at 3×, the "perf"
// project) over a throttled connection: Slow 4G (150 ms, 1.6 Mbps down,
// 750 kbps up) and a CPU four times slower. Each page is loaded once to
// warm the server's image cache, then twice with an empty browser cache,
// and the worse of the two runs is checked. KB here is 1024 bytes.
//
// The numbers suit a developer laptop. A slower CI machine may need more
// headroom for LCP; the byte budgets don't depend on the machine.

const KB = 1024;
const LCP_BUDGET_MS = 2500;
const CLS_BUDGET = 0.01;

// bytes: everything the page transfers. js: the page's own scripts plus
// the shared app scripts, gzipped, as listed in the build manifest.
const budgets = {
  "/": { bytes: 500 * KB, js: 128 * KB, page: "/" },
  "/shop": { bytes: 550 * KB, page: "/shop" },
  "/shop/love": { bytes: 550 * KB, js: 137 * KB, page: "/shop/[slug]" },
  "/about": { bytes: 350 * KB, page: "/about" },
};

// Reads the build the test server is running (npm run build writes .next).
function scriptGzipBytes(page) {
  const dir = path.join(process.cwd(), ".next");
  const manifest = JSON.parse(
    fs.readFileSync(path.join(dir, "build-manifest.json"), "utf8"),
  );
  const files = new Set(
    [...manifest.pages["/_app"], ...manifest.pages[page]].filter((file) =>
      file.endsWith(".js"),
    ),
  );
  let total = 0;
  for (const file of files) {
    total += zlib.gzipSync(fs.readFileSync(path.join(dir, file))).length;
  }
  return total;
}

// Hosts the old site loaded from. None may be contacted now.
const THIRD_PARTY = [
  "js.stripe.com",
  "m.stripe.network",
  "www.googletagmanager.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

async function measure(browser, baseURL, route) {
  const { viewport, deviceScaleFactor, isMobile, hasTouch } =
    test.info().project.use;
  const context = await browser.newContext({
    baseURL,
    viewport,
    deviceScaleFactor,
    isMobile,
    hasTouch,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const hosts = new Set();
  let bytes = 0;
  cdp.on("Network.requestWillBeSent", (e) => {
    const url = new URL(e.request.url);
    if (url.protocol.startsWith("http")) hosts.add(url.host);
  });
  cdp.on("Network.loadingFinished", (e) => {
    bytes += e.encodedDataLength;
  });

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__perf.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(route, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(500);
  const { lcp, cls } = await page.evaluate(() => window.__perf);
  await context.close();
  return { bytes, lcp, cls, hosts: [...hosts] };
}

for (const [route, budget] of Object.entries(budgets)) {
  test(`${route} stays inside its transfer, LCP and layout shift budgets`, async ({
    page,
    browser,
    baseURL,
  }) => {
    test.setTimeout(120_000);
    await page.goto(route, { waitUntil: "networkidle" });

    const runs = [
      await measure(browser, baseURL, route),
      await measure(browser, baseURL, route),
    ];
    const worst = {
      bytes: Math.max(...runs.map((r) => r.bytes)),
      lcp: Math.max(...runs.map((r) => r.lcp)),
      cls: Math.max(...runs.map((r) => r.cls)),
    };
    const js = scriptGzipBytes(budget.page);
    const report = {
      route,
      transferKB: +(worst.bytes / KB).toFixed(1),
      scriptGzipKB: +(js / KB).toFixed(1),
      lcpSeconds: +(worst.lcp / 1000).toFixed(2),
      cls: +worst.cls.toFixed(4),
    };
    console.log(`perf ${JSON.stringify(report)}`);
    await test.info().attach("perf.json", {
      body: JSON.stringify(report, null, 2),
      contentType: "application/json",
    });

    const local = new URL(baseURL).host;
    for (const run of runs) {
      expect(run.hosts.filter((host) => THIRD_PARTY.includes(host))).toEqual(
        [],
      );
      expect(run.hosts).toEqual([local]);
    }
    expect(worst.bytes, "bytes transferred").toBeLessThan(budget.bytes);
    expect(worst.lcp, "largest contentful paint (ms)").toBeGreaterThan(0);
    expect(worst.lcp, "largest contentful paint (ms)").toBeLessThan(
      LCP_BUDGET_MS,
    );
    expect(worst.cls, "cumulative layout shift").toBeLessThanOrEqual(
      CLS_BUDGET,
    );
    if (budget.js) {
      expect(js, "JavaScript bytes, gzipped").toBeLessThanOrEqual(budget.js);
    }
  });
}
