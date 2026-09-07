import type { Drink } from "./types";

const STORAGE_KEY = "drinks-journal:v1";
const CHANGE_EVENT = "drinks-journal-change";

let cachedRaw: string | null | undefined;
let cachedDrinks: Drink[] = [];

export function getDrinksSnapshot(): Drink[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedDrinks;

  cachedRaw = raw;
  cachedDrinks = parseDrinks(raw);
  return cachedDrinks;
}

export function getServerDrinksSnapshot(): Drink[] {
  return [];
}

export function subscribeDrinks(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CHANGE_EVENT, handler);
  };
}

export function saveDrinks(drinks: Drink[]) {
  const raw = JSON.stringify(drinks);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedDrinks = drinks;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function parseDrinks(raw: string | null): Drink[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDrink);
  } catch {
    return [];
  }
}

function isDrink(value: unknown): value is Drink {
  if (!value || typeof value !== "object") return false;
  const drink = value as Partial<Drink>;
  return (
    typeof drink.id === "string" &&
    typeof drink.name === "string" &&
    typeof drink.category === "string" &&
    typeof drink.rating === "number"
  );
}
