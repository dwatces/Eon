import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
     pk_live_51KE0EfIILjXbtSkj5J1V7alYhwwpzCnHeF4zx8M5JKUZ0ksN4MKbglfxvoGXJdh5YCdkGKjPEGrKf3gLoLuIROWD00kFMnNZti
    );
  }
  return stripePromise;
};

export default getStripe;
