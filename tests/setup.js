import { afterEach, vi } from "vitest";

// Components read the router through next/router. Component tests get a
// static router on "/".
vi.mock("next/router", () => {
  const router = {
    pathname: "/",
    asPath: "/",
    query: {},
    isReady: true,
    push: () => Promise.resolve(true),
    replace: () => Promise.resolve(true),
    prefetch: () => Promise.resolve(),
    events: { on: () => {}, off: () => {}, emit: () => {} },
  };
  return { useRouter: () => router, default: router };
});

// Testing Library only cleans up on its own when test globals are on.
afterEach(async () => {
  if (typeof document === "undefined") return;
  const { cleanup } = await import("@testing-library/react");
  cleanup();
});
