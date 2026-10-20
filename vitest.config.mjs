import { defineConfig } from "vitest/config";

// Static image imports are a Next.js bundler feature. In unit tests they
// resolve to a small object shaped like Next's, with `src` set to the file
// path so tests can check the file exists.
const imageStub = {
  name: "eon-image-stub",
  enforce: "pre",
  load(id) {
    const file = id.split("?")[0];
    if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(file)) {
      return `export default ${JSON.stringify({ src: file, width: 1, height: 1 })};`;
    }
    return null;
  },
};

export default defineConfig({
  plugins: [imageStub],
  // Next.js allows JSX in .js files; Vite only transforms .jsx by default.
  oxc: {
    include: /\.js$/,
    exclude: /node_modules/,
    lang: "jsx",
    jsx: { runtime: "automatic" },
  },
  test: {
    include: ["tests/**/*.test.{js,mjs}"],
    // Unit tests run in Node. Component tests opt in to jsdom with a
    // `// @vitest-environment jsdom` comment at the top of the file.
    environment: "node",
    setupFiles: ["tests/setup.js"],
    restoreMocks: true,
    unstubEnvs: true,
    // `npm run test:coverage`: the shop's logic lives in lib/ and the API
    // route, and both must stay at 90% of lines or more.
    coverage: {
      provider: "v8",
      include: ["lib/**", "pages/api/**"],
      // next/font/local declarations only run inside the Next.js compiler.
      exclude: ["lib/fonts.js"],
      reporter: ["text", "html"],
      thresholds: { lines: 90 },
    },
  },
});
