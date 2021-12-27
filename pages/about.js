import { useState } from "react";
import styles from "../styles/About.module.css";
import Layout from "../components/Layout";
const axios = require("axios");

const About = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = [name, email, message];
    axios
      .post("http://localhost:5000/send", { data })
      .then(
        setMessage(
          "We have received your message, and will reply as soon as we can! "
        )
      )

      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.about}>
      <Layout>
        <main className={styles.main}>
          <div className={styles.crystals}>
            <div className={styles.crystalHeaderText}>
              <h1 className={styles.crystalHeader}>
                <span className={styles.crystalHeaderAbout}>About</span>
                <span className={styles.headerSplit}>
                  <span className={styles.split}></span>
                </span>
                <a href="#contact" className={styles.crystalHeaderContact}>
                  <span>Contact Us</span>
                </a>
              </h1>
              <p className={styles.crystalsText}>
                We're Kiwis that love to bring positive energies into all lifes.
                Our boutique candles are more than just pleasant scents. All our
                candles are handcrafted, combining both the energy of crystals,
                and the natural world, to provide uplifting aromas to elevate
                you to the spirtiaul realm.
              </p>
              <p className={styles.crystalsText}>
                Made in the earth eons ago, crystals carry an inate power to
                direct positive energies into our bodies and souls; whilst
                warding from the negative. Our vegan soy wax candles each have a
                unique, beautiful scent profile, derived from all natural
                ingredients. We pair each scent with a magically chosen crystal
                and natural accompaniment. This enables you to reach a higher
                level of being; which we must nurture to bring out our best
                selves.
              </p>
            </div>
          </div>
          <div className={styles.nzNatural}>
            <p className={styles.envText}>
              We love our planet, that's why our candles are made of vegan soy
              wax, and we ship all our candles in recyclable or biodegradeable
              packaging. Our candle tins are easily repurposable as well! After
              washing, use our tins as a place to keep trinkets, keepsakes,
              memories, or anything special!
            </p>
          </div>
          <section id="contact">
            <div className={styles.contactBox}>
              <h2 className={styles.contactHeader}>CONTACT US</h2>
              <div className={styles.contactFormWrapper}>
                <form onSubmit={handleSubmit} id="contact-form">
                  <div className={styles.formItem}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      name="name"
                    />
                    <label htmlFor="name" className={styles.formLabel}>
                      Name:
                    </label>
                  </div>
                  <div className={styles.formItem}>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <label htmlFor="email" className={styles.formLabel}>
                      Email:
                    </label>
                  </div>
                  <div className={styles.formItem}>
                    <textarea
                      name="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      className={styles.formArea}
                      name="message"
                    ></textarea>
                    <label htmlFor="message" className={styles.formLabel}>
                      Message:
                    </label>
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    Send
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  );
};

export default About;
