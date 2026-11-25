/* The four certification categories that have a panel, by card title. */

export type CategoryKey = "invest" | "advisory" | "quant" | "data";

export const categoryKeyByTitle: Record<string, CategoryKey> = {
  "Investment & Markets": "invest",
  "Advisory & Wealth Planning": "advisory",
  "Quantitative & Statistical Methods": "quant",
  "Data & Business Intelligence": "data",
};
