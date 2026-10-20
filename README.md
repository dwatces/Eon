# Eon

Website and online shop for Eon, a New Zealand candle brand, built with Next.js and Stripe Checkout.

**Live site:** [eon-ht82.vercel.app](https://eon-ht82.vercel.app/)

![Eon home page: a banner photo of the four candle tins with crystals, then the Eon logo and tagline](docs/screenshot.webp)

## About

Eon's candles are hand-poured in vegan soy wax, each paired with crystal chips and flowers. This repo is the brand's site: a home page, a shop page, a page for each of the four candles (love, happiness, dreams and summer), an about page, and a cart with a checkout that is priced on the server.

The live site is a portfolio demo: checkout shows an order summary and takes no payment.

The first version was built between December 2021 and February 2022. In June 2026 the site was restyled with a small design system (cream, terracotta and sage palette, Fraunces and Raleway type) and simpler flex and grid layouts.

## Features

- One product route (`pages/shop/[slug].js`) that builds a static page for each candle from the catalogue, with a photo gallery, a full-screen lightbox built on the native `<dialog>` element, a quantity stepper and an add-to-cart button that confirms each add.
- A cart kept in `localStorage` through a pure reducer (`lib/cart.js`), with prices in cents taken from one catalogue (`data/candles.js`). It survives a reload and stays in sync across tabs.
- A checkout API route (`pages/api/checkout_sessions.js`) that validates the cart and prices it on the server. With no Stripe key it returns a demo order summary; with a Stripe test key it creates a Stripe Checkout session limited to New Zealand addresses, with a flat NZ$5 shipping rate (1 to 3 business days).
- Responsive navigation with a mobile menu and a cart count.
- Security headers in `next.config.js`, including a Content-Security-Policy that allows only the site's own scripts, fonts and connections.
- Self-hosted fonts, so pages make no third-party requests.

## Tech stack

- Next.js 16 (pages router) and React 19
- CSS Modules, with shared design tokens as CSS custom properties in `styles/globals.css`, and fonts through `next/font/local`
- Stripe's Node SDK on the server (the browser needs no Stripe key)
- react-icons
- Vitest for unit and API tests, Playwright for end-to-end tests, ESLint 9 and Prettier
- Node 24 (pinned in `package.json` and `.nvmrc`), deployed on Vercel

## Running locally

You need Node 24.

```bash
npm ci
npm run dev
```

Then open http://localhost:3000. No environment variables are needed: checkout runs in demo mode. To try a real Stripe test-mode hand-off, copy `.env.example` to `.env.local` and set `STRIPE_SECRET_KEY` to a Stripe test key. `.env.example` explains every variable.

Other scripts:

- `npm run build` and `npm run start`: production build and server
- `npm run lint` and `npm run format:check`
- `npm test`: unit, API and component tests
- `npm run test:e2e`: end-to-end tests against a local production build (set `CHROME_PATH` to use an installed Chrome, or run `npx playwright install chromium` first)

## Project structure

```
pages/          Home, shop, about, cart, success, 404 and 500 pages
pages/shop/     [slug].js: one statically generated page per candle
pages/api/      checkout_sessions.js (validates the cart, demo or Stripe)
components/     Nav bar, footer, product card and gallery, cart controls, SEO tags
data/           The candle catalogue, product copy and product photos
hooks/          Cart context
lib/            Cart, checkout, money, site URL and font helpers
styles/         Global design tokens, per-page CSS Modules and the font files
tests/          Vitest unit, API and component tests
e2e/            Playwright end-to-end tests
public/         Product photos, icons and the social card image
scripts/        Writes robots.txt and sitemap.xml at build
```

## Author

Built by Daniel Olliver. More of my work: [danielolliver.com/dev](https://danielolliver.com/dev/).

I also run [Olliver Web](https://olliverweb.co.nz), a web design and development studio in Auckland.

Ben Jones contributed early responsive layout work between December 2021 and January 2022.
