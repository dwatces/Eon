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
import altPicCrystal from "../../public/Crystal-dreams.png";
import altPicFlower from "../../public/Flower-Dream.png";
import altPicLit from "../../public/lit-dreams.png";
import mainPic from "../../public/lid-dreams.png";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const Dreams = () => {
  const images = [
    "/lid-dreams.png",
    "/Flower-Dream.png",
    "/Crystal-dreams.png",
    "/lit-dreams.png",
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
      addItem(products[2], qty);
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
    productName="dreams candle"
    description="Follow your dreams with our lavender, chamomile, and frankincense candle. Paired with the powerful energy of amethyst crystals to provide clarity of mind, and cornflowers to bring wealth and good fortune."
    manufacturerName="Eon"
    material="candle"
    award="best scented candle in NZ"
    aggregateRating={{
      ratingValue: "4.4",
      reviewCount: "89",
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
                alt="dreams flower"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicLit}
                alt="dreams lit"
                className={styles.candleSize}
                responsive="true"
                priority
              />
            </button>
          </div>
          <h1 style={{ display: "none" }}>Crystal Candle Dreams</h1>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicCrystal}
                alt="dreams crystal"
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
                alt="dreams main"
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
            <h2 className={styles.candleTitle}>dreams</h2>
            <p className={styles.candleDescription}>
              Follow your dreams with our lavender, chamomile, and frankincense
              candle. Paired with the powerful energy of amethyst crystals to
              provide clarity of mind, and cornflowers to bring wealth and good
              fortune.
            </p>

            <div className={styles.containerBuy}>
              <p className={styles.candleRetail}>
                $20<sup className={styles.candlePrice}>$30</sup>
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

export default Dreams;
