// Sets the checkout-related env vars for one test and restores them after.
const NAMES = [
  "STRIPE_SECRET_KEY",
  "EON_ALLOW_LIVE_PAYMENTS",
  "EON_STRIPE_API_BASE",
  "VERCEL_ENV",
  "VERCEL_URL",
  "VERCEL_BRANCH_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
];

export function setCheckoutEnv(values = {}) {
  const saved = Object.fromEntries(
    NAMES.map((name) => [name, process.env[name]]),
  );
  for (const name of NAMES) {
    if (values[name] === undefined) delete process.env[name];
    else process.env[name] = values[name];
  }
  return () => {
    for (const name of NAMES) {
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    }
  };
}
