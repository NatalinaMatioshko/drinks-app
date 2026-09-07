"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getDrinksSnapshot,
  getServerDrinksSnapshot,
  saveDrinks,
  subscribeDrinks,
} from "@/lib/storage";
import type { Drink, DrinkDraft, SortId } from "@/lib/types";

export function useDrinks() {
  const drinks = useSyncExternalStore(
    subscribeDrinks,
    getDrinksSnapshot,
    getServerDrinksSnapshot,
  );

  const addDrink = useCallback((draft: DrinkDraft) => {
    const now = new Date().toISOString();
    const drink: Drink = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    saveDrinks([drink, ...getDrinksSnapshot()]);
    return drink;
  }, []);

  const updateDrink = useCallback((id: string, draft: DrinkDraft) => {
    const now = new Date().toISOString();
    saveDrinks(
      getDrinksSnapshot().map((drink) =>
        drink.id === id ? { ...drink, ...draft, updatedAt: now } : drink,
      ),
    );
  }, []);

  const removeDrink = useCallback((id: string) => {
    saveDrinks(getDrinksSnapshot().filter((drink) => drink.id !== id));
  }, []);

  const stats = useMemo(() => {
    const withPrice = drinks.filter((drink) => drink.price !== null);
    const spent = withPrice.reduce((sum, drink) => sum + (drink.price ?? 0), 0);
    const averageRating =
      drinks.length === 0
        ? 0
        : drinks.reduce((sum, drink) => sum + drink.rating, 0) / drinks.length;

    return {
      count: drinks.length,
      spent,
      pricedCount: withPrice.length,
      averageRating,
    };
  }, [drinks]);

  return {
    drinks,
    stats,
    addDrink,
    updateDrink,
    removeDrink,
  };
}

export function sortDrinks(drinks: Drink[], sort: SortId) {
  const copy = [...drinks];
  copy.sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price") return (b.price ?? -1) - (a.price ?? -1);
    return b.triedAt.localeCompare(a.triedAt) || b.createdAt.localeCompare(a.createdAt);
  });
  return copy;
}
