import styles from "../styles/About.module.css";
import Image from "next/image";
import Crystal from "../public/crystals.webp";
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
              lives. Our boutique soy candles are more than just pleasant
              scents. At Eon, all our candles are handcrafted, combining both
              the energy of crystals, and the natural world, to provide
              uplifting aromas for peace, positivity and healing.
            </p>
            <p className={styles.crystalsText}>
              Made in the earth eons ago, crystals carry an inate power to
              direct positive energies into our bodies and souls; whilst warding
              from the negative. Our vegan soy wax candles each have a unique,
              beautiful scent profile, derived from all natural ingredients. We
              pair each scent with a magically chosen crystal and natural
              accompaniment. Once light by fire, the energy released is
              amplified, in turn, enabling you to reach a higher level of being;
              in which we must nurture to bring out our best selves, order
              online today!
            </p>
            <br />
          </div>
          <Image
            src={Crystal}
            alt="crystal about page"
            width={800}
            height={130}
            layout="responsive"
            priority
            className={styles.crystalImg}
          />
        </div>
        <div className={styles.nzNatural}>
          <p className={styles.envText}>
            We love our planet, that&apos;s why our candles are made of vegan
            soy wax, and we ship all our candles in recyclable and
            biodegradeable packaging. Our candle tins are easily repurposable as
            well! After washing, use our tins as a place to keep trinkets,
            keepsakes, or anything special!
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
