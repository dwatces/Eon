import { useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Lightbox from "./Lightbox";
import { nextIndex, prevIndex } from "../lib/gallery";
import styles from "./ProductGallery.module.css";

// The product photos: one main photo, thumbnails that choose it (wide
// screens), Previous and Next buttons (narrower screens), and the main
// photo opens the full-screen lightbox at the photo being shown.
//
// photos: [{src (static import), alt}], in catalogue order.
export default function ProductGallery({ name, photos }) {
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const count = photos.length;
  const photo = photos[current];

  // Paging in the lightbox moves the main photo with it.
  const showInLightbox = (index) => {
    setLightboxIndex(index);
    setCurrent(index);
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <button
          type="button"
          className={styles.mainButton}
          onClick={() => setLightboxIndex(current)}
          aria-label="View larger photo"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            sizes="(min-width: 520px) 460px, 100vw"
            className={styles.mainImage}
            loading="eager"
            fetchPriority="high"
          />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          onClick={() => setCurrent(prevIndex(current, count))}
          aria-label="Previous photo"
        >
          <IoIosArrowBack size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => setCurrent(nextIndex(current, count))}
          aria-label="Next photo"
        >
          <IoIosArrowForward size={22} aria-hidden="true" />
        </button>
        <p className={styles.position} aria-live="polite">
          Photo {current + 1} of {count}
          <span className={styles.visuallyHidden}>: {photo.alt}</span>
        </p>
      </div>
      <ul className={styles.thumbs} aria-label={`${name} candle photos`}>
        {photos.map((thumb, index) => (
          <li key={thumb.alt}>
            <button
              type="button"
              className={styles.thumb}
              onClick={() => setCurrent(index)}
              aria-pressed={index === current}
            >
              <Image
                src={thumb.src}
                alt={thumb.alt}
                sizes="84px"
                className={styles.thumbImage}
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        images={photos}
        index={lightboxIndex}
        onIndexChange={showInLightbox}
        onClose={() => setLightboxIndex(null)}
        label={`${name} candle photos`}
      />
    </div>
  );
}
