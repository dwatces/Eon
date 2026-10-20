import React, { useState } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import "react-image-lightbox/style.css";
import Layout from "../../components/Layout";
import Lightbox from "react-image-lightbox";
import { products } from "../../components/products";
import { getCandle } from "../../data/candles";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import altPicFlower from "../../public/Flower-love.webp";
import altPicCrystal from "../../public/crystal-love.webp";
import altPicLit from "../../public/lit-love.webp";
import mainPic from "../../public/lid-love.webp";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const candle = getCandle("love");

const Love = () => {
  const images = [
    "/lid-love.png",
    "/Flower-love.png",
    "/crystal-love.png",
    "/lit-love.png",
  ];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [crystal, setCrystal] = useState(false);
  const [flower, setFlower] = useState(false);
  const { addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [cartClicked, setCartClicked] = useState(false);

  const handleOnAddToCart = () => {
    addItem(products[0], qty);
    setCartClicked(true);
  };

  const open = () => {
    setIsOpen(true);
  };

  return (
    <Layout>
      <Head>
        <title>Love</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicFlower}
                alt="love flower"
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
                alt="love lit"
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
                alt="love crystal"
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
              className={`${styles.mobileGallery} ${styles.galleryBack}`}
            />
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={mainPic}
                alt="love main"
                className={styles.candleMain}
                responsive="true"
                priority
              />
            </button>
            <IoIosArrowForward
              onClick={open}
              className={`${styles.mobileGallery} ${styles.galleryForward}`}
            />
          </div>
        </div>
        <div className={styles.candleContent}>
          <div className={styles.candleContentHeader}>
            <h1 className={styles.candleTitle}>{candle.name}</h1>
            <p className={styles.candleDescription}>
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
              Our rose otto, ylang ylang, orange, and patchouli scented candle
              smells divine and has been precisely paired with rose quartz chips
              and rose buds to amplify and attract love into your life. Rose
              Quartz is a very popular crystal, and one of our favourites for
              its powerful and varied benefits. Rose Quartz is calming;
              providing a reassuring and gentle atmosphere to any room. Rose
              quartz promotes love, friendship, healing and deep inner peace but
              most importantly, rose quartz has the powerful ability to dispel
              negativity and replace it with positive energies. This is why we
              chose to imbue our rose otto, ylang ylang, orange, and patchouli
              crystal with rose quarts, we truely believe it will amplify the
              loves in your life to new heights!
            </p>
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

export default Love;
