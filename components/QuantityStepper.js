import { useId } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MAX_QTY } from "../data/candles";
import styles from "./QuantityStepper.module.css";

// A labelled − / value / + control, clamped to min..max.
//
// The buttons use aria-disabled rather than disabled at the limits, so a
// keyboard user who reaches 10 with + keeps focus on it.
export default function QuantityStepper({
  value,
  onChange,
  label = "Quantity",
  itemName,
  hideLabel = false,
  min = 1,
  max = MAX_QTY,
}) {
  const labelId = useId();
  const atMin = value <= min;
  const atMax = value >= max;
  const suffix = itemName ? ` of ${itemName}` : "";

  const change = (next) => {
    if (next < min || next > max) return;
    onChange(next);
  };

  return (
    <div role="group" aria-labelledby={labelId} className={styles.stepper}>
      <span
        id={labelId}
        className={hideLabel ? styles.visuallyHidden : styles.label}
      >
        {label}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => change(value - 1)}
        aria-disabled={atMin}
        aria-label={`Decrease quantity${suffix}`}
      >
        <AiOutlineMinus aria-hidden="true" />
      </button>
      <output className={styles.value} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={styles.button}
        onClick={() => change(value + 1)}
        aria-disabled={atMax}
        aria-label={`Increase quantity${suffix}`}
      >
        <AiOutlinePlus aria-hidden="true" />
      </button>
    </div>
  );
}
