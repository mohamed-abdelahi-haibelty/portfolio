// Serves the local production build the way Vercel's CDN does (HTTP/2, TLS,
// brotli) so Lighthouse's simulated throttling measures what visitors get.
// Plain `next start` is HTTP/1.1 + gzip, which Lighthouse models with per-request
// connection costs that the real site does not have.
//
// https://localhost:3400 (HTTP/2) → http://localhost:3401 (next start)
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { request } from "node:http";
import { createSecureServer } from "node:http2";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createBrotliCompress } from "node:zlib";

const PORT = 3400;
const UPSTREAM_PORT = 3401;
const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-connection",
  "transfer-encoding",
  "upgrade",
  "content-length",
]);
const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|manifest)|image\/svg)/;

// A throwaway self-signed certificate for localhost (Chrome runs with --ignore-certificate-errors).
const certDir = mkdtempSync(join(tmpdir(), "lhci-cert-"));
execFileSync(
  "openssl",
  [
    "req",
    "-x509",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-days",
    "1",
    "-subj",
    "/CN=localhost",
    "-keyout",
    join(certDir, "key.pem"),
    "-out",
    join(certDir, "cert.pem"),
  ],
  { stdio: "ignore" },
);
const key = readFileSync(join(certDir, "key.pem"));
const cert = readFileSync(join(certDir, "cert.pem"));
rmSync(certDir, { recursive: true, force: true });

const next = spawn("pnpm", ["exec", "next", "start", "--port", String(UPSTREAM_PORT)], {
  stdio: ["ignore", "pipe", "inherit"],
});

const server = createSecureServer({ key, cert, allowHTTP1: false }, (req, res) => {
  const headers = Object.fromEntries(
    Object.entries(req.headers).filter(([name]) => !name.startsWith(":")),
  );
  const upstream = request(
    {
      host: "localhost",
      port: UPSTREAM_PORT,
      method: req.method,
      path: req.url,
      headers: { ...headers, host: `localhost:${PORT}`, "accept-encoding": "identity" },
    },
    (upstreamRes) => {
      const out = {};
      for (const [name, value] of Object.entries(upstreamRes.headers)) {
        if (!HOP_BY_HOP.has(name) && value !== undefined) out[name] = value;
      }
      const type = String(upstreamRes.headers["content-type"] ?? "");
      const accepts = String(req.headers["accept-encoding"] ?? "").includes("br");
      if (accepts && COMPRESSIBLE.test(type)) {
        res.writeHead(upstreamRes.statusCode ?? 502, { ...out, "content-encoding": "br" });
        upstreamRes.pipe(createBrotliCompress()).pipe(res);
      } else {
        res.writeHead(upstreamRes.statusCode ?? 502, out);
        upstreamRes.pipe(res);
      }
    },
  );
  upstream.on("error", () => {
    res.writeHead(502).end();
  });
  req.pipe(upstream);
});

let ready = false;
next.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  if (!ready && String(chunk).includes("Ready")) {
    ready = true;
    server.listen(PORT, () => {
      process.stdout.write(`lhci server ready on https://localhost:${PORT}\n`);
    });
  }
});

function stop() {
  server.close();
  next.kill("SIGTERM");
  process.exit(0);
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
next.on("exit", (code) => {
  server.close();
  process.exit(code ?? 1);
});
