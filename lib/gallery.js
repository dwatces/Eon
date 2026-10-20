// Wrap-around index helpers for galleries and the lightbox.
export const nextIndex = (index, count) =>
  count > 0 ? (index + 1) % count : 0;

export const prevIndex = (index, count) =>
  count > 0 ? (index - 1 + count) % count : 0;
