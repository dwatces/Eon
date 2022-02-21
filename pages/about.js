import styles from "../styles/About.module.css";
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.crystals}>
          <div className={styles.crystalHeaderText}>
            <h1 className={styles.crystalHeader}>
              <span className={styles.crystalHeaderAbout}>About</span>

              <span className={styles.split}></span>

              <a href="#contact">
                <span>Contact Us</span>
              </a>
            </h1>
            <p className={styles.crystalsText}>
              We&apos;re Kiwis that love to bring positive energies into all
              lives. Our boutique candles are more than just pleasant scents. At
              Eon, all our candles are handcrafted, combining both the energy of
              crystals, and the natural world, to provide uplifting aromas for
              peace, positivity and healing. Our scents are made using all
              natural ingredients chosen with love and care to create beautiful
              scent profiles which we then pair with powerful crystals and
              natural accompaniments to create a powerful and elegant candle
              that will fit perfectly into your life.
            </p>
            <p className={styles.crystalsText}>
              Made in the earth eons ago, crystals carry an inate power to
              direct positive energies into our bodies and souls; whilst warding
              from the negative. Our vegan soy wax candles each have a unique,
              beautiful scent profile, derived from all natural ingredients. We
              pair each scent with a magically chosen crystal and natural
              accompaniment. Once light by fire, the energy released is
              amplified, in turn, enabling you to reach a higher level of being;
              in which we must nurture to bring out our best selves. Our crystal
              imbued candles will help you fight off negative feelings, align
              with and promote positive energies, and grow your mind, body and
              soul. They help you find your natural, inner strength, love,
              compassion, and perseverance and amplify these positives energies
              within you to new heights; order online today!
            </p>
            <br />
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className={styles.nzNatural}>
          <p className={styles.envText}>
            We love our planet, and our clean, green country that&apos;s why our
            candles are made of vegan soy wax, and we ship all our candles in
            recyclable and bio-degradeable packaging. Cardboard boxes filled
            with natural wood wool, wrapped in a compostable bag keeps your
            candle safe and sound while it makes its journey through our
            beautiful Aoteroa to you. Our candle tins are easily repurposable as
            well! After washing, use our tins as a place to keep trinkets,
            keepsakes, or anything special to you!
          </p>
        </div>
        <div className={styles.contactBox} id="contact">
          <h2 className={styles.contactHeader}>
            Connect with us:
            <br />
            <a className={styles.email} href="mailto:contact@eoncandles.co.nz">
              contact@eoncandles.co.nz
            </a>
          </h2>
        </div>
      </main>
    </Layout>
  );
};

export default About;
