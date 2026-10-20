import localFont from "next/font/local";

// Self-hosted Latin subsets (see styles/fonts/OFL.txt), so pages make no
// requests to Google and the build needs no network.
export const fraunces = localFont({
  src: "../styles/fonts/fraunces-latin-opsz-wght.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const raleway = localFont({
  src: "../styles/fonts/raleway-latin-wght.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: "Arial",
});
