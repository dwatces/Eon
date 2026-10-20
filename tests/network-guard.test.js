import http from "node:http";
import https from "node:https";
import { afterEach, describe, expect, it } from "vitest";
import { takeBlockedConnections } from "./helpers/network-guard.js";

// example.invalid is a reserved name that never resolves, so even a broken
// guard could not reach a real server from these tests.
const OUTSIDE = "example.invalid";

const servers = [];
afterEach(async () => {
  await Promise.all(
    servers.splice(0).map((s) => new Promise((done) => s.close(done))),
  );
});

describe("the test network guard", () => {
  it("blocks fetch to any host other than localhost", async () => {
    await expect(fetch(`https://${OUTSIDE}/`)).rejects.toThrow();
    expect(takeBlockedConnections()).toEqual([OUTSIDE]);
  });

  it("blocks Node's http and https clients", async () => {
    for (const client of [http, https]) {
      const error = await new Promise((resolve) => {
        client
          .get(`${client === http ? "http" : "https"}://${OUTSIDE}/`)
          .on("error", resolve)
          .on("response", () => resolve(null));
      });
      expect(error?.code).toBe("ENETUNREACH");
      expect(error.message).toMatch(/Tests may not use the network/);
    }
    expect(takeBlockedConnections()).toEqual([OUTSIDE, OUTSIDE]);
  });

  it("lets tests talk to a server on 127.0.0.1", async () => {
    const server = http.createServer((_req, res) => res.end("ok"));
    servers.push(server);
    await new Promise((done) => server.listen(0, "127.0.0.1", done));
    const res = await fetch(`http://127.0.0.1:${server.address().port}/`);
    expect(await res.text()).toBe("ok");
    expect(takeBlockedConnections()).toEqual([]);
  });
});
