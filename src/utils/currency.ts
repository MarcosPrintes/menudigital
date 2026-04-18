/**
 * Parses common Brazilian currency strings (e.g. "R$ 1.234,56", "10,50", "12.34") into a number.
 * Returns null when the value cannot be interpreted as a positive amount.
 */
export function parseCurrencyToNumber(input: string): number | null {
  const s = input.trim().replace(/\s/g, "");
  if (!s) {
    return null;
  }

  const withoutSymbol = s.replace(/^R\$/i, "");

  // Brazilian thousands + decimal: 1.234,56
  if (/^\d{1,3}(\.\d{3})*(,\d{1,2})$/.test(withoutSymbol)) {
    return Number.parseFloat(withoutSymbol.replace(/\./g, "").replace(",", "."));
  }

  // Dot as decimal: 1234.56
  if (/^\d+(\.\d{1,2})?$/.test(withoutSymbol)) {
    return Number.parseFloat(withoutSymbol);
  }

  // Comma as decimal only: 1234,56
  if (/^\d+,\d{1,2}$/.test(withoutSymbol)) {
    return Number.parseFloat(withoutSymbol.replace(",", "."));
  }

  return null;
}
