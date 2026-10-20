const nzd = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
});

// Formats integer New Zealand cents for display, e.g. 2000 -> "$20.00".
export const formatNZD = (cents) => nzd.format(cents / 100);
