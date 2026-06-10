import { MATERIAL_PRESETS } from "./material-presets";
import type { PartDefinition, PartsConfig } from "./types";

/** Base price of the shoe before any premium customization. */
export const BASE_PRICE = 220;

/** Surcharge applied when a part's color diverges from the model default. */
const CUSTOM_COLOR_SURCHARGE = 4;

export interface PriceLineItem {
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  base: number;
  total: number;
  lineItems: PriceLineItem[];
}

/**
 * Computes the live price: base price + premium material upgrades + a small
 * surcharge for any part recolored away from its factory default.
 */
export function calculatePrice(parts: PartsConfig, defs: PartDefinition[]): PriceBreakdown {
  const materialTotals = new Map<string, number>();
  let customColorCount = 0;

  for (const def of defs) {
    const config = parts[def.id];
    if (!config) continue;

    const preset = MATERIAL_PRESETS[config.material];
    if (preset.priceModifier > 0) {
      materialTotals.set(preset.label, (materialTotals.get(preset.label) ?? 0) + preset.priceModifier);
    }

    if (config.color.toLowerCase() !== def.default.color.toLowerCase()) {
      customColorCount += 1;
    }
  }

  const lineItems: PriceLineItem[] = [];
  for (const [label, amount] of materialTotals) {
    lineItems.push({ label: `${label} upgrade`, amount });
  }
  if (customColorCount > 0) {
    lineItems.push({
      label: `Custom colorway (${customColorCount} part${customColorCount === 1 ? "" : "s"})`,
      amount: customColorCount * CUSTOM_COLOR_SURCHARGE,
    });
  }

  const total = BASE_PRICE + lineItems.reduce((sum, item) => sum + item.amount, 0);

  return { base: BASE_PRICE, total, lineItems };
}
