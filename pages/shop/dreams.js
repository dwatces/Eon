import React, { useState } from "react";
import { useShoppingCart } from "../../hooks/use-shopping-cart";
import Link from "next/link";
import "react-image-lightbox/style.css";
import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
import Lightbox from "react-image-lightbox";
import { getCandle } from "../../data/candles";
import { formatNZD } from "../../lib/money";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/Candles.module.css";
import altPicCrystal from "../../public/Crystal-dreams.webp";
import altPicFlower from "../../public/Flower-Dream.webp";
import altPicLit from "../../public/lit-dreams.webp";
import mainPic from "../../public/lid-dreams.webp";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const candle = getCandle("dreams");

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
  const { addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [cartClicked, setCartClicked] = useState(false);

  const handleOnAddToCart = () => {
    addItem(candle.slug, qty);
    setCartClicked(true);
  };

  const open = () => {
    setIsOpen(true);
  };

  return (
    <Layout>
      <Head>
        <title>Dreams</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.galleryContainer}>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicFlower}
                alt="dreams flower"
                className={styles.candleSize}
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
                priority
              />
            </button>
          </div>
          <div className={styles.galleryImage}>
            <button className={styles.buttonImage} type="button" onClick={open}>
              <Image
                src={altPicCrystal}
                alt="dreams crystal"
                className={styles.candleSize}
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
                alt="dreams main"
                className={styles.candleMain}
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
            <div className={styles.candleDescription}>
              <div className={styles.containerBuy}>
                <p className={styles.candleRetail}>
                  {formatNZD(candle.unitAmount)}
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
                  <Link href="/cart" passHref>
                    <a className={styles.submitButton}>CHECKOUT</a>
                  </Link>
                )}
              </div>

              <p>{candle.description}</p>
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
