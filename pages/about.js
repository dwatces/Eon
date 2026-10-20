import Image from "next/image";
import styles from "../styles/About.module.css";
import Seo from "../components/Seo";
import rangePhoto from "../assets/images/eon-range.webp";

const About = () => {
  return (
    <>
      <Seo
        title="About Eon"
        description="About Eon, a New Zealand candle label that pairs hand-poured vegan soy candles with crystals and botanicals, in tins made to be reused."
        path="/about"
      />
      <main id="main" className={styles.main}>
        <div className={styles.story}>
          <h1 className={styles.title}>About Eon</h1>
          <div className={styles.copy}>
            <p>
              We&apos;re Kiwis who love to bring positive energies into all
              lives. Our boutique candles are more than just pleasant scents. At
              Eon, all our candles are handcrafted, combining both the energy of
              crystals, and the natural world, to provide uplifting aromas for
              peace, positivity and healing. Our scents are made using all
              natural ingredients chosen with love and care to create beautiful
              scent profiles which we then pair with powerful crystals and
              natural accompaniments to create a powerful and elegant candle
              that will fit perfectly into your life.
            </p>
            <p>
              Made in the earth eons ago, crystals carry an innate power to
              direct positive energies into our bodies and souls; whilst warding
              from the negative. Our vegan soy wax candles each have a unique,
              beautiful scent profile, derived from all natural ingredients. We
              pair each scent with a magically chosen crystal and natural
              accompaniment. Once lit, the energy released is amplified, in
              turn, enabling you to reach a higher level of being; in which we
              must nurture to bring out our best selves. Our crystal imbued
              candles will help you fight off negative feelings, align with and
              promote positive energies, and grow your mind, body and soul. They
              help you find your natural, inner strength, love, compassion, and
              perseverance and amplify these positive energies within you to new
              heights.
            </p>
          </div>
          <figure className={styles.figure}>
            <Image
              src={rangePhoto}
              alt="The four Eon candle tins, Dreams, Summer, Love and Happiness, with tumbled crystals"
              sizes="(min-width: 900px) 340px, (min-width: 480px) 400px, calc(100vw - 3rem)"
              placeholder="blur"
              className={styles.photo}
            />
          </figure>
        </div>
        <section className={styles.nzNatural} aria-labelledby="packaging">
          <div className={styles.band}>
            <h2 id="packaging" className={styles.sectionTitle}>
              Packaging
            </h2>
            <p>
              We love our planet, and our clean, green country; that&apos;s why
              our candles are made of vegan soy wax, and we ship all our candles
              in recyclable and biodegradable packaging. Cardboard boxes filled
              with natural wood wool, wrapped in a compostable bag keeps your
              candle safe and sound while it makes its journey through our
              beautiful Aotearoa to you. Our candle tins are easily repurposable
              as well! After washing, use our tins as a place to keep trinkets,
              keepsakes, or anything special to you!
            </p>
          </div>
        </section>
        <section
          className={styles.contactBox}
          id="contact"
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title" className={styles.sectionTitle}>
            Contact
          </h2>
          <p>
            This site is a portfolio demo of the Eon shop, so it takes no orders
            or enquiries.
          </p>
        </section>
      </main>
    </>
  );
};

export default About;
