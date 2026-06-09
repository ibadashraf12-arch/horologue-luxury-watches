/**
 * Vercel Build Output API v3 assembly script.
 *
 * Produces:
 *   .vercel/output/static/               ← client assets
 *   .vercel/output/functions/ssr.func/   ← single-file bundled Node.js function
 *   .vercel/output/config.json           ← routing
 *
 * The SSR bundle is created with esbuild so that all npm dependencies
 * (h3-v2, react, @tanstack/*, seroval, …) are inlined.  Only Node.js
 * built-ins (node:stream, node:async_hooks, …) remain external.
 */

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── 1. Vite build (VERCEL=1 disables the Cloudflare adapter) ─────────────────
console.log("⏳  Running Vite build…");
execSync("bun run build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VERCEL: "1" },
});

// ── 2. Reset output dir ───────────────────────────────────────────────────────
const outDir = join(root, ".vercel", "output");
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });

// ── 3. Static assets ──────────────────────────────────────────────────────────
const staticDir = join(outDir, "static");
mkdirSync(staticDir, { recursive: true });
cpSync(join(root, "dist", "client"), staticDir, { recursive: true });
console.log("✅  Static assets copied.");

// ── 4. SSR function ───────────────────────────────────────────────────────────
const funcDir = join(outDir, "functions", "ssr.func");
mkdirSync(funcDir, { recursive: true });

// Thin Vercel handler entry — imports the Vite-compiled server and wraps it
// in the Node.js http (req, res) interface.  Uses Readable.fromWeb() so that
// TanStack Start's streaming SSR response is piped correctly without buffering.
const entryPath = join(root, "_vercel_entry_tmp.mjs");
writeFileSync(
  entryPath,
  `
import server from ${JSON.stringify(join(root, "dist", "server", "server.js").replace(/\\\\/g, "/"))};
import { Readable } from "node:stream";

export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host  = req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "localhost";
  const url   = new URL(req.url, \`\${proto}://\${host}\`);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((val) => headers.append(k, val));
    else if (v != null) headers.set(k, v);
  }

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = new ReadableStream({
      start(ctrl) {
        req.on("data",  (chunk) => ctrl.enqueue(chunk));
        req.on("end",   ()      => ctrl.close());
        req.on("error", (err)   => ctrl.error(err));
      },
    });
  }

  const request  = new Request(url, { method: req.method, headers, body });
  const response = await server.fetch(request, {}, {});

  res.status(response.status);
  for (const [k, v] of response.headers) res.setHeader(k, v);

  if (response.body) {
    Readable.fromWeb(response.body).pipe(res);
  } else {
    res.end();
  }
}
`.trimStart()
);

// esbuild: bundle the handler + Vite server output + all npm deps into one file.
// Only node: built-ins remain external (they are available in any Node.js runtime).
console.log("⏳  Bundling SSR function with esbuild…");
execSync(
  [
    "bunx esbuild",
    JSON.stringify(entryPath),
    "--bundle",
    "--platform=node",
    "--format=esm",
    "--external:node:*",
    `--outfile=${JSON.stringify(join(funcDir, "index.js"))}`,
  ].join(" "),
  { cwd: root, stdio: "inherit" }
);
rmSync(entryPath);
console.log("✅  SSR function bundled.");

// Function config — Node.js 20 serverless
writeFileSync(
  join(funcDir, ".vc-config.json"),
  JSON.stringify({ runtime: "nodejs20.x", handler: "index.js", maxDuration: 30 }, null, 2)
);

// ── 5. Routing ────────────────────────────────────────────────────────────────
writeFileSync(
  join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "^/assets/(.*)$",  dest: "/assets/$1"  },
        { src: "^/frames/(.*)$",  dest: "/frames/$1"  },
        { src: "^/sounds/(.*)$",  dest: "/sounds/$1"  },
        { src: "^/watches/(.*)$", dest: "/watches/$1" },
        { src: "^/(.*)$",        dest: "/ssr"         },
      ],
    },
    null,
    2
  )
);
console.log("✅  Vercel routing config written.");

// ── 6. Bundle size report ─────────────────────────────────────────────────────
import { statSync } from "node:fs";
const bundleSize = statSync(join(funcDir, "index.js")).size;
console.log(`\n📦  SSR bundle: ${(bundleSize / 1024).toFixed(1)} kB`);
console.log("🎉  .vercel/output/ ready.  Deploy with: bunx vercel deploy --prebuilt --prod --archive=tgz");
