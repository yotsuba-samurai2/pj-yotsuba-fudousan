// Child probe. Run only inside the proposed sandbox, using a newly owned synthetic socket path.
import assert from "node:assert/strict";
import net from "node:net";
import dgram from "node:dgram";
import { resolve } from "node:path";
const directory = process.argv[2];
assert.match(directory, /^\/(?:private\/)?var\/folders\/[a-z0-9]+\/[a-z0-9]+\/T\/com\.google\.Chrome\.[A-Za-z0-9]{6}$/);
const socket = resolve(directory, "SingletonSocket"), checks = [];
const permissionDenied = error => error && ["EPERM", "EACCES"].includes(error.code);
async function denied(name, create) {
  let resource;
  try {
    const error = await new Promise((finish, reject) => {
      const timer = setTimeout(() => reject(new Error("PROBE_TIMEOUT")), 1200);
      const end = e => { clearTimeout(timer); finish(e); };
      resource = create(end); resource.once("error", end);
    });
    assert.ok(permissionDenied(error), `${name}: expected permission denial`); checks.push({ name, passed: true });
  } finally { resource?.destroy?.(); try { resource?.close?.(); } catch { /* not bound */ } }
}
const server = net.createServer(c => c.destroy());
try {
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(socket, resolve); });
  checks.push({ name: "approved_singleton_bind_and_listen", passed: true });
  await denied("unix_outbound_denied_even_to_owned_socket", done => net.connect(socket, () => done(null)));
  await denied("different_unix_socket_name_denied", done => net.createServer().listen(resolve(directory, "OtherSocket"), () => done(null)));
  await denied("tcp_loopback_outbound_denied", done => net.connect({ host: "127.0.0.1", port: 9 }, () => done(null)));
  await denied("tcp_ipv6_loopback_outbound_denied", done => net.connect({ host: "::1", port: 9 }, () => done(null)));
  await denied("tcp_listener_denied", done => net.createServer().listen({ host: "127.0.0.1", port: 0 }, () => done(null)));
  await denied("udp_loopback_denied", done => { const s = dgram.createSocket("udp4"); s.send("synthetic", 9, "127.0.0.1", done); return s; });
  console.log(JSON.stringify({ checks, passed: true, dnsQueriesIssued: false, externalDestinationUsed: false }));
} finally { if (server.listening) await new Promise(resolve => server.close(resolve)); }
