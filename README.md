# Eon

Website and online shop for Eon, a New Zealand candle brand, built with Next.js and Stripe Checkout.

**Live site:** [eon-ht82.vercel.app](https://eon-ht82.vercel.app/)

![Eon home page: a banner photo of the four candle tins with crystals, then the Eon logo and tagline](docs/screenshot.webp)

## About

Eon's candles are hand-poured in vegan soy wax, each paired with crystal chips and flowers. This repo is the brand's site: a home page, a shop page, a page for each of the four candles (love, happiness, dreams and summer), an about page with contact details, and a cart that hands off to Stripe Checkout for payment.

The first version was built between December 2021 and February 2022. In June 2026 the site was restyled with a small design system (cream, terracotta and sage palette, Fraunces and Raleway type) and simpler flex and grid layouts.

## Features

- Four product pages, each with a photo gallery and full-screen lightbox, a quantity selector and an add-to-cart button.
- A shopping cart held in React context with a reducer and saved to `localStorage`, so it survives a page reload.
- A Next.js API route (`pages/api/checkout_sessions.js`) that creates a Stripe Checkout session from the cart items, limited to New Zealand shipping addresses, with a flat NZ$5 shipping rate (1 to 3 business days). Products map to Stripe Price IDs in `components/products.js`.
- An order confirmation page that clears the cart.
- Responsive navigation with a mobile menu and a cart count badge.
- Security headers (HSTS, `X-Frame-Options`, `X-Content-Type-Options` and others) set in `next.config.js`.
- `robots.txt`, `sitemap.xml` and Open Graph meta tags.

## Tech stack

- Next.js 12 (pages router) and React 17
- CSS Modules, with shared design tokens as CSS custom properties in `styles/globals.css`
- Stripe (`stripe` on the server, `@stripe/stripe-js` in the browser) and axios
- react-image-lightbox, react-icons and MUI icons
- Node 20.x (pinned in `package.json`), deployed on Vercel

## Running locally

You need Node 20.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The other scripts are `npm run build`, `npm run start` and `npm run lint`.

Browsing the site and using the cart need no configuration. Checkout uses two Stripe values, which go in `.env.local` (ignored by git):

- `STRIPE_SECRET_KEY`: server side, used by the checkout API route
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: browser side, used to redirect to Stripe

Known issue: `pages/api/checkout_sessions.js` and `components/get-stripe.js` currently use these as bare names instead of reading `process.env.STRIPE_SECRET_KEY` and `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, so checkout will not run until those two lines read from `process.env`. The Price IDs in `components/products.js` also belong to the original Stripe account, so with your own keys you would need to create matching prices and update those IDs.

## Project structure

```
pages/          Home, shop, about, cart, success, 404 and 500 pages
pages/shop/     One page per candle: love, happiness, dreams, summer
pages/api/      checkout_sessions.js (creates the Stripe Checkout session)
components/     Nav bar, footer, header banner, layouts, product list, Stripe loader
hooks/          Cart context and the localStorage-backed reducer
lib/            Small helpers (utils.js), plus an unused Shopify Storefront helper
styles/         Global design tokens and per-page CSS Modules
public/         Product photos, icons, fonts, robots.txt and sitemap.xml
```

## Author

Built by Daniel Olliver. More of my work: [danielolliver.com/dev](https://danielolliver.com/dev/).

I also run [Olliver Web](https://olliverweb.co.nz), a web design and development studio in Auckland.

Ben Jones contributed early responsive layout work between December 2021 and January 2022.
