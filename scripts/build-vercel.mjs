/**
 * Vercel Build Output API v3 assembly script.
 *
 * Produces:
 *   .vercel/output/static/           ← client assets (JS, CSS, public files)
 *   .vercel/output/functions/ssr.func/  ← Node.js serverless function (SSR)
 *   .vercel/output/config.json        ← routing: statics first, then SSR catch-all
 *
 * Run via:  VERCEL=1 bun run build && node scripts/build-vercel.mjs
 * (vite.config.ts reads VERCEL=1 to disable the Cloudflare adapter)
 */

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── 1. Run the Vite build (Cloudflare adapter disabled via VERCEL=1) ──────────
console.log("⏳  Building (VERCEL=1)…");
execSync("bun run build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VERCEL: "1" },
});

// ── 2. Wipe previous output ───────────────────────────────────────────────────
const outDir = join(root, ".vercel", "output");
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });

// ── 3. Static assets ──────────────────────────────────────────────────────────
const staticDir = join(outDir, "static");
mkdirSync(staticDir, { recursive: true });
cpSync(join(root, "dist", "client"), staticDir, { recursive: true });
console.log("✅  Static assets copied.");

// ── 4. SSR serverless function ────────────────────────────────────────────────
const funcDir = join(outDir, "functions", "ssr.func");
mkdirSync(funcDir, { recursive: true });

// Copy the entire server bundle (all hashed asset chunks) into the func dir.
cpSync(join(root, "dist", "server"), funcDir, { recursive: true });

// Vercel Node.js serverless function entry: adapts Web Fetch API ↔ Node.js http.
writeFileSync(
  join(funcDir, "index.js"),
  `
import server from "./server.js";

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
        req.on("data", (chunk) => ctrl.enqueue(chunk));
        req.on("end",  ()      => ctrl.close());
        req.on("error",(err)   => ctrl.error(err));
      },
    });
  }

  const request  = new Request(url, { method: req.method, headers, body });
  const response = await server.fetch(request, {}, {});

  res.status(response.status);
  for (const [k, v] of response.headers) res.setHeader(k, v);
  res.end(Buffer.from(await response.arrayBuffer()));
}
`.trimStart()
);

// Function metadata: Node.js 20 runtime.
writeFileSync(
  join(funcDir, ".vc-config.json"),
  JSON.stringify({ runtime: "nodejs20.x", handler: "index.js", maxDuration: 30 }, null, 2)
);
console.log("✅  SSR function created.");

// ── 5. Routing config ─────────────────────────────────────────────────────────
writeFileSync(
  join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Serve known static directories directly (no SSR needed).
        { src: "^/assets/(.*)$",  dest: "/assets/$1"  },
        { src: "^/frames/(.*)$",  dest: "/frames/$1"  },
        { src: "^/sounds/(.*)$",  dest: "/sounds/$1"  },
        { src: "^/watches/(.*)$", dest: "/watches/$1" },
        // Everything else → SSR function.
        { src: "^/(.*)$", dest: "/ssr" },
      ],
    },
    null,
    2
  )
);
console.log("✅  Vercel routing config written.");
console.log("\n🎉  .vercel/output/ is ready. Deploy with: vercel --prebuilt");
