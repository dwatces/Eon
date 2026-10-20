import http from "node:http";

// A local stand-in for the two Stripe API calls the shop makes:
// POST /v1/checkout/sessions to start checkout, and
// GET /v1/checkout/sessions/:id to check a session on the order page. The
// API routes talk to it when EON_STRIPE_API_BASE points at it, so the real
// Stripe SDK can be tested end to end without any request leaving the
// machine.
//
// Modes: "ok" answers normally, "auth" with Stripe's 401 for a bad key,
// "error" with a 500 that Stripe marks as not worth retrying.
//
// Known sessions: STUB_SESSION_ID is complete and paid (NZ$65.00, test
// mode), STUB_OPEN_SESSION_ID is still open. Any other id is a 404, as
// Stripe answers for a session that doesn't exist.

export const STUB_SESSION_ID = "cs_test_stub";
export const STUB_OPEN_SESSION_ID = "cs_test_stubopen";
export const STUB_SESSION_URL = `https://checkout.stripe.com/c/pay/${STUB_SESSION_ID}`;

const SESSIONS = {
  [STUB_SESSION_ID]: {
    status: "complete",
    payment_status: "paid",
    amount_total: 6500,
    // Fields the shop must never pass on to the browser.
    customer_details: { email: "shopper@example.test", name: "Stub Shopper" },
  },
  [STUB_OPEN_SESSION_ID]: {
    status: "open",
    payment_status: "unpaid",
    amount_total: 2500,
  },
};

const SESSION_PATH = /^\/v1\/checkout\/sessions\/([^/?]+)$/;

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
      const retrieve = req.method === "GET" && SESSION_PATH.exec(req.url);
      const create =
        req.method === "POST" && req.url === "/v1/checkout/sessions";
      if (!retrieve && !create) {
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
      if (retrieve) {
        const id = decodeURIComponent(retrieve[1]);
        const session = SESSIONS[id];
        if (!session) {
          return reply(res, 404, {
            error: {
              type: "invalid_request_error",
              code: "resource_missing",
              param: "session",
              message: `No such checkout.session: '${id}'`,
            },
          });
        }
        return reply(res, 200, {
          id,
          object: "checkout.session",
          currency: "nzd",
          livemode: false,
          ...session,
        });
      }
      return reply(res, 200, {
        id: STUB_SESSION_ID,
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
