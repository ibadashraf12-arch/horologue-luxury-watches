import type { PartsConfig } from "./types";

const QUERY_KEY = "config";

/** Encode a parts configuration into a compact, URL-safe base64 string. */
export function encodeConfig(parts: PartsConfig): string {
  const json = JSON.stringify(parts);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a configuration previously produced by {@link encodeConfig}. */
export function decodeConfig(encoded: string): PartsConfig | null {
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const base64 = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const json = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object") return parsed as PartsConfig;
    return null;
  } catch {
    return null;
  }
}

/** Build a shareable URL containing the given configuration. */
export function buildShareUrl(parts: PartsConfig): string {
  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_KEY, encodeConfig(parts));
  return url.toString();
}

/** Read a configuration from the current page URL, if present. */
export function readConfigFromUrl(): PartsConfig | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(QUERY_KEY);
  if (!encoded) return null;
  return decodeConfig(encoded);
}
