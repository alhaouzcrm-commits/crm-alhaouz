export const months = [
  "يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو",
  "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"
];

export function parseDate(d: string) {
  const m = String(d || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const monthIdx = parseInt(m[2], 10) - 1;
  return {
    y: m[1],
    m: months[monthIdx] || "",
    d: String(parseInt(m[3], 10))
  };
}

export function formatDateText(d: string): string {
  const parsed = parseDate(d);
  if (!parsed) return d || "";
  return `${parsed.d} ${parsed.m} ${parsed.y}`;
}

export function extractDigits(n: string): string {
  return String(n || "").replace(/[^\d+]/g, "");
}

export function formatLocalPhone(n: string): string {
  const d = extractDigits(n);
  if (d.startsWith("+212")) {
    return ("0" + d.slice(4)).replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }
  return d;
}

export function getCleanWhatsApp(phone: string): string {
  return extractDigits(phone).replace("+", "");
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
