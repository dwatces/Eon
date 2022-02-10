import React, { useState } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import axios from "axios";
import Link from "next/link";
import getStripe from "../../components/get-stripe";
import { ProductJsonLd } from "next-seo";
import Image from "next/image";
import Layout from "../../components/Layout";
import Lightbox from "react-image-lightbox";
import { products } from "../../components/products";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import altPicFlower from "../../public/Flower-Summer.png";
import altPicCrystal from "../../public/crystal-summer.png";
import altPicLit from "../../public/lit-summer.png";
import mainPic from "../../public/lid-summer.png";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const Summer = () => {
  const images = [
    "/lid-summer.png",
    "/Flower-Summer.png",
    "/crystal-summer.png",
    "/lit-summer.png",
  ];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);
  const { addItem, cartDetails } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [cartClicked, setCartClicked] = useState(false);

  const handleOnAddToCart = async () => {
    if (!cartClicked) {
      addItem(products[3], qty);
      setCartClicked(true);
    }

    if (cartClicked) {
      const {
        data: { id },
      } = await axios.post("../api/checkout_sessions", {
        items: Object.entries(cartDetails).map(([_, { id, quantity }]) => ({
          price: id,
          quantity,
        })),
      });

      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id });
    }
  };
  const open = () => {
    setIsOpen(true);
  };

  <ProductJsonLd
    productName="summer candle"
    description="Bring on the summer vibes with our coconut, mango, and lime scented candle. Paired with both aventurine crystal shards for good blessings and lavender flowers for peace and grace."
    manufacturerName="Eon"
    material="candle"
    award="best scented candle in NZ"
    aggregateRating={{
      ratingValue: "4.9",
      reviewCount: "72",
    }}
  />;

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicFlower}
                alt="summer flower"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
          <h1 style={{ display: "none" }}>Crystal Candle Summer</h1>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicLit}
                alt="summer lit"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicCrystal}
                alt="summer crystal"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
        </div>
        <div className={styles.galleryMainContainer}>
          <div className={styles.mainImage}>
            <IoIosArrowBack
              onClick={open}
              className={(styles.mobileGallery, styles.galleryBack)}
            />
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={mainPic}
                alt="summer main"
                className={styles.candleMain}
                responsive="true"
                priority
              />
            </button>
            <IoIosArrowForward
              onClick={open}
              className={(styles.mobileGallery, styles.galleryForward)}
            />
          </div>
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h2 className={styles.candleTitle}>summer</h2>
            <p className={styles.candleDescription}>
              Bring on the summer vibes with our coconut, mango, and lime
              scented candle. Paired with both aventurine crystal shards for
              good blessings and lavender flowers for peace and grace.
            </p>
            <div className={styles.containerBits}>
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setCrystal(true);
                }}
              >
                <span className={styles.headerUnderline}>Aventurine</span>
              </h3>
              <h3
                className={styles.containerBitsHeader}
                onMouseEnter={(e) => {
                  setFlower(true);
                }}
              >
                <span className={styles.headerUnderline}>
                  Lavender Flowers{" "}
                </span>
              </h3>
              {crystal && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setCrystal(false);
                  }}
                >
                  This high energy crystal will attract abundance and prosperity
                  to your life. It is a comforter and a harmoniser, bringing
                  luck and blessings to your life. A perfect accompaniment to a
                  summer&apos;s evening.
                </p>
              )}
              {flower && (
                <p
                  className={styles.bitsText}
                  onMouseLeave={(e) => {
                    setFlower(false);
                  }}
                >
                  These flowers represent serenity, grace, peace, and calmness.
                  These energies are exactly what summer is all about!
                </p>
              )}
            </div>
            <div className={styles.containerBuy}>
              <p className={styles.candleRetail}>
                $25<sup className={styles.candlePrice}>$30</sup>
              </p>
              <p className={styles.quantity}>Quantity:</p>
              <button
                className={styles.candleQuantity}
                onClick={() => setQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="decrease quantity by one"
              >
                <AiOutlineMinus />
              </button>
              <p>{qty}</p>
              <button
                className={styles.candleQuantity}
                onClick={() => setQty(qty + 1)}
                aria-label="increase quantity by one"
              >
                <AiOutlinePlus />
              </button>
              {!cartClicked ? (
                <button
                  className={styles.submitButton}
                  onClick={handleOnAddToCart}
                  type="button"
                >
                  ADD TO CART
                </button>
              ) : (
                <Link href="/cart">
                  <button className={styles.submitButton} type="button">
                    CHECKOUT
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[photoIndex + 1]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() => setPhotoIndex(0)}
            onMoveNextRequest={() => setPhotoIndex(photoIndex + 1)}
          />
        )}
      </main>
    </Layout>
  );
};

export default Summer;
