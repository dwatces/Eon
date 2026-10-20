import Head from "next/head";
import { absoluteUrl } from "../lib/site";

export const SITE_NAME = "Eon Candles";
const OG_IMAGE = "/og-eon.jpg";
const OG_IMAGE_ALT = "Four Eon candle tins in a row with crystals in front";

// The page title, description, canonical link and social cards, all
// built from the one site URL (lib/site.js). Pages that should stay out
// of search results pass noindex; pages with no address of their own
// (404, 500) pass no path and get no canonical link.
export default function Seo({ title, description, path, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = path ? absoluteUrl(path) : null;
  const image = absoluteUrl(OG_IMAGE);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} key="description" />
      {url && <link rel="canonical" href={url} key="canonical" />}
      {noindex && <meta name="robots" content="noindex" key="robots" />}
      <meta property="og:title" content={fullTitle} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      {url && <meta property="og:url" content={url} key="og:url" />}
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:image" content={image} key="og:image" />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} key="og:image:alt" />
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta name="twitter:image" content={image} key="twitter:image" />
    </Head>
  );
}
