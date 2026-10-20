import http from "node:http";

// A local stand-in for the one Stripe API call the shop makes,
// POST /v1/checkout/sessions. The checkout route talks to it when
// EON_STRIPE_API_BASE points at it, so the real Stripe SDK can be tested
// end to end without any request leaving the machine.
//
// Modes: "ok" answers with a session, "auth" with Stripe's 401 for a bad
// key, "error" with a 500 that Stripe marks as not worth retrying.

export const STUB_SESSION_URL =
  "https://checkout.stripe.com/c/pay/cs_test_stub";

function reply(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

export function startStripeStub({ port = 0, mode = "ok" } = {}) {
  const requests = [];
  let current = mode;

  const server = http.createServer((req, res) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      requests.push({
        method: req.method,
        path: req.url,
        // Only whether a key was sent, never the key itself.
        auth: req.headers.authorization ? "present" : "none",
        form: Object.fromEntries(new URLSearchParams(raw)),
      });
      if (req.method !== "POST" || req.url !== "/v1/checkout/sessions") {
        return reply(res, 404, { error: { type: "invalid_request_error" } });
      }
      if (current === "auth") {
        return reply(res, 401, {
          error: {
            type: "invalid_request_error",
            message: "Invalid API Key provided",
          },
        });
      }
      if (current === "error") {
        return reply(
          res,
          500,
          { error: { type: "api_error", message: "Stub failure" } },
          { "Stripe-Should-Retry": "false" },
        );
      }
      return reply(res, 200, {
        id: "cs_test_stub",
        object: "checkout.session",
        url: STUB_SESSION_URL,
      });
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      const { port: bound } = server.address();
      resolve({
        url: `http://127.0.0.1:${bound}`,
        requests,
        setMode: (next) => {
          current = next;
        },
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}
