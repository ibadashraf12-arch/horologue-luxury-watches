import type { PartsConfig } from "./types";

const STORAGE_KEY = "shoe-configurator:saved-config";

export function saveConfigToStorage(parts: PartsConfig): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
  } catch {
    // Storage unavailable (private mode, etc.) — fail silently.
  }
}

export function loadConfigFromStorage(): PartsConfig | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as PartsConfig;
    return null;
  } catch {
    return null;
  }
}

export function hasSavedConfig(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Trigger a browser download of the configuration as a JSON file. */
export function downloadConfigAsJson(parts: PartsConfig, filename = "shoe-configuration.json"): void {
  const blob = new Blob([JSON.stringify(parts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
