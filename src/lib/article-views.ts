const prefix = "traveld_views_";

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getFullViewsForDay(
  userId: string,
  date: Date = new Date(),
): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(
    `${prefix}${userId}_${dayKey(date)}`,
  );
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function recordFullView(userId: string, slug: string): void {
  if (typeof window === "undefined") return;
  const key = `${prefix}${userId}_${dayKey(new Date())}`;
  const existing = new Set(getFullViewsForDay(userId));
  existing.add(slug);
  window.localStorage.setItem(key, JSON.stringify([...existing]));
}

export function countDistinctFullViewsToday(userId: string): number {
  return getFullViewsForDay(userId).length;
}

export function hasFullViewedToday(userId: string, slug: string): boolean {
  return getFullViewsForDay(userId).includes(slug);
}
