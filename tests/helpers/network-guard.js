import net from "node:net";

// Unit and API tests never use the network. Every outgoing connection
// (Node's http and https, fetch, and the Stripe SDK all open one through
// net.Socket#connect) is checked here. A connection to anything other than
// localhost fails like an unreachable host, and is recorded so the test
// fails even if the code under test catches the error.

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

// Kept on globalThis: the test runner reuses a worker process for several
// test files, each with fresh modules, but net.Socket is patched only once.
const KEY = Symbol.for("eon.blockedConnections");
globalThis[KEY] ??= [];
const blocked = () => globalThis[KEY];

function targetOf(args) {
  const [first, second] = args;
  // net.connect() passes its normalised arguments as one array.
  const options = Array.isArray(first) ? first[0] : first;
  if (options && typeof options === "object") {
    if (options.path) return null; // a local socket file, not the network
    return options.host ?? "localhost";
  }
  if (typeof first === "string" && !/^\d+$/.test(first)) return null; // path
  return typeof second === "string" ? second : "localhost";
}

export function installNetworkGuard() {
  const connect = net.Socket.prototype.connect;
  if (connect.isNetworkGuard) return;

  function guardedConnect(...args) {
    const host = targetOf(args);
    if (host === null || LOCAL_HOSTS.has(host)) {
      return connect.apply(this, args);
    }
    const message = `Tests may not use the network: blocked a connection to ${host}`;
    blocked().push(host);
    const error = Object.assign(new Error(message), { code: "ENETUNREACH" });
    process.nextTick(() => this.destroy(error));
    return this;
  }
  guardedConnect.isNetworkGuard = true;
  net.Socket.prototype.connect = guardedConnect;
}

// Returns the hosts blocked since the last call, and forgets them.
export const takeBlockedConnections = () => blocked().splice(0);
