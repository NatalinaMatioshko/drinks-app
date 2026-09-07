"use client";

import { CATEGORIES, type CategoryId, type Drink, type DrinkDraft } from "@/lib/types";
import { todayIsoDate } from "@/lib/format";
import { useId, useState, type FormEvent, type ReactNode } from "react";

const emptyDraft = (): DrinkDraft => ({
  name: "",
  category: "coffee",
  brand: "",
  place: "",
  triedAt: todayIsoDate(),
  price: null,
  rating: 7,
  notes: "",
});

type DrinkFormProps = {
  drink?: Drink | null;
  onClose: () => void;
  onSave: (draft: DrinkDraft) => void;
  onDelete?: () => void;
};

function toDraft(drink?: Drink | null): DrinkDraft {
  if (!drink) return emptyDraft();
  return {
    name: drink.name,
    category: drink.category,
    brand: drink.brand,
    place: drink.place,
    triedAt: drink.triedAt,
    price: drink.price,
    rating: drink.rating,
    notes: drink.notes,
  };
}

export function DrinkForm({ drink, onClose, onSave, onDelete }: DrinkFormProps) {
  const formId = useId();
  const [draft, setDraft] = useState<DrinkDraft>(() => toDraft(drink));
  const [error, setError] = useState("");

  function update<K extends keyof DrinkDraft>(key: K, value: DrinkDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError("Додайте назву напою.");
      return;
    }
    onSave({
      ...draft,
      name,
      brand: draft.brand.trim(),
      place: draft.place.trim(),
      notes: draft.notes.trim(),
    });
  }

  const isEditing = Boolean(drink);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(36,28,22,0.45)] p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Закрити"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[var(--line)] bg-[var(--foam)] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-[var(--muted)] uppercase">
              {isEditing ? "Редагування" : "Новий запис"}
            </p>
            <h2 className="font-serif text-2xl text-[var(--ink)]">
              {isEditing ? drink?.name : "Що ми спробували?"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"
          >
            Закрити
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <Field label="Назва" htmlFor={`${formId}-name`}>
            <input
              id={`${formId}-name`}
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Наприклад, еспресо з Ковчегу"
              className="field-input"
              autoFocus
            />
          </Field>

          <Field label="Категорія" htmlFor={`${formId}-category`}>
            <select
              id={`${formId}-category`}
              value={draft.category}
              onChange={(event) => update("category", event.target.value as CategoryId)}
              className="field-input"
            >
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Бренд / виробник" htmlFor={`${formId}-brand`}>
              <input
                id={`${formId}-brand`}
                value={draft.brand}
                onChange={(event) => update("brand", event.target.value)}
                placeholder="Кав'ярня, виноробня…"
                className="field-input"
              />
            </Field>
            <Field label="Де спробували" htmlFor={`${formId}-place`}>
              <input
                id={`${formId}-place`}
                value={draft.place}
                onChange={(event) => update("place", event.target.value)}
                placeholder="Дім, заклад, подорож"
                className="field-input"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Дата" htmlFor={`${formId}-date`}>
              <input
                id={`${formId}-date`}
                type="date"
                value={draft.triedAt}
                onChange={(event) => update("triedAt", event.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Ціна, ₴" htmlFor={`${formId}-price`}>
              <input
                id={`${formId}-price`}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={draft.price ?? ""}
                onChange={(event) => {
                  const next = event.target.value;
                  update("price", next === "" ? null : Number(next));
                }}
                placeholder="0"
                className="field-input"
              />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-[var(--ink)]">
              Оцінка смаку
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, index) => {
                const value = index + 1;
                const selected = draft.rating === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("rating", value)}
                    className={`h-10 w-10 rounded-full text-sm font-medium transition ${
                      selected
                        ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                        : "bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--chip)]"
                    }`}
                    aria-pressed={selected}
                    aria-label={`Оцінка ${value} з 10`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {draft.rating <= 4
                ? "Слабко, навряд чи візьмемо ще раз"
                : draft.rating <= 7
                  ? "Нормально, можна повторити"
                  : "Дуже смачно — запам’ятати"}
            </p>
          </fieldset>

          <Field label="Нотатки про смак" htmlFor={`${formId}-notes`}>
            <textarea
              id={`${formId}-notes`}
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={4}
              placeholder="Кислинка, післясмак, з чим пили, чи варто брати знову…"
              className="field-input resize-y"
            />
          </Field>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-4">
          {isEditing && onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="text-sm text-[var(--danger)] hover:underline"
            >
              Видалити
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--paper)]"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--accent-ink)] hover:opacity-90"
            >
              Зберегти
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">{label}</span>
      {children}
    </label>
  );
}
