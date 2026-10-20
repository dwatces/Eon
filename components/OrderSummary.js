import { formatNZD } from "../lib/money";
import styles from "./OrderSummary.module.css";

// A priced order as a table: one row per candle, then the subtotal,
// shipping and total. Used for the demo order summary.
export default function OrderSummary({ order, caption }) {
  return (
    <table className={styles.table}>
      <caption className={styles.caption}>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Candle</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody>
        {order.lines.map((line) => (
          <tr key={line.slug}>
            <th scope="row">{line.name}</th>
            <td>{line.quantity}</td>
            <td>{formatNZD(line.lineTotal)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colSpan={2}>
            Subtotal
          </th>
          <td>{formatNZD(order.subtotal)}</td>
        </tr>
        <tr>
          <th scope="row" colSpan={2}>
            Shipping (New Zealand)
          </th>
          <td>{formatNZD(order.shipping)}</td>
        </tr>
        <tr className={styles.total}>
          <th scope="row" colSpan={2}>
            Total (NZD)
          </th>
          <td>{formatNZD(order.total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
