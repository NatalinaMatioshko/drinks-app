export const CATEGORIES = [
  { id: "coffee", label: "Кава" },
  { id: "tea", label: "Чай" },
  { id: "wine", label: "Вино" },
  { id: "beer", label: "Пиво" },
  { id: "cocktail", label: "Коктейль" },
  { id: "spirits", label: "Міцне" },
  { id: "soft", label: "Безалкогольне" },
  { id: "other", label: "Інше" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Drink = {
  id: string;
  name: string;
  category: CategoryId;
  brand: string;
  place: string;
  triedAt: string;
  price: number | null;
  rating: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type DrinkDraft = Omit<Drink, "id" | "createdAt" | "updatedAt">;

export type SortId = "newest" | "rating" | "price";
