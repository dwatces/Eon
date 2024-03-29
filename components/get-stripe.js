import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
  }
  return stripePromise;
};

export default getStripe;
