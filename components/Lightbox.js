import { useEffect, useRef } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { nextIndex, prevIndex } from "../lib/gallery";
import styles from "../styles/Lightbox.module.css";

// A full-screen photo viewer built on the native <dialog> element.
// showModal() gives focus containment, Escape to close and an inert page
// behind it. Focus returns to whatever opened it.
//
// images: [{src (static import), alt}]; index: open photo, or null when closed.
export default function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  label,
}) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const isOpen = index !== null && index !== undefined;
  const count = images.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      onClose();
      const opener = openerRef.current;
      if (opener && typeof opener.focus === "function") opener.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const show = (next) => onIndexChange(next);

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      // Keep Tab cycling through the dialog's own controls.
      const controls = [...dialogRef.current.querySelectorAll("button")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(nextIndex(index, count));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(prevIndex(index, count));
    }
  };

  // A click on the backdrop lands on the dialog element itself.
  const handleClick = (event) => {
    if (event.target === dialogRef.current) dialogRef.current.close();
  };

  const image = isOpen ? images[index] : null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {image && (
        <div className={styles.frame}>
          <div className={styles.imageWrap}>
            <Image
              key={index}
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="contain"
              sizes="(min-width: 900px) 80vw, 100vw"
            />
          </div>
          <p className={styles.caption} aria-live="polite">
            <span>{image.alt}</span>
            <span className={styles.counter}>
              Image {index + 1} of {count}
            </span>
          </p>
          <button
            type="button"
            className={`${styles.control} ${styles.prev}`}
            onClick={() => show(prevIndex(index, count))}
            aria-label="Previous image"
          >
            <IoIosArrowBack size={28} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            onClick={() => show(nextIndex(index, count))}
            aria-label="Next image"
          >
            <IoIosArrowForward size={28} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.close}`}
            onClick={() => dialogRef.current.close()}
            aria-label="Close"
          >
            <IoMdClose size={28} aria-hidden="true" />
          </button>
        </div>
      )}
    </dialog>
  );
}
