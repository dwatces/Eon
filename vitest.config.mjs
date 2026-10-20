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
  test: {
    include: ["tests/**/*.test.{js,mjs}"],
    environment: "node",
    restoreMocks: true,
    unstubEnvs: true,
  },
});
