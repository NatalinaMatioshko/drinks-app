"use client";

import { CATEGORIES, type Drink } from "@/lib/types";
import { formatDate, formatPrice, formatRating } from "@/lib/format";

type DrinkCardProps = {
  drink: Drink;
  onEdit: (drink: Drink) => void;
};

export function DrinkCard({ drink, onEdit }: DrinkCardProps) {
  const category = CATEGORIES.find((item) => item.id === drink.category);

  return (
    <article>
      <button
        type="button"
        onClick={() => onEdit(drink)}
        className="group flex w-full flex-col rounded-3xl border border-[var(--line)] bg-[var(--foam)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:shadow-[0_18px_40px_rgba(92,58,46,0.08)]"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-medium tracking-wide text-[var(--ink)]">
            {category?.label ?? drink.category}
          </span>
          <span className="font-serif text-3xl leading-none text-[var(--accent)]">
            {formatRating(drink.rating)}
          </span>
        </div>

        <h2 className="font-serif text-2xl leading-snug text-[var(--ink)]">
          {drink.name}
        </h2>
        {drink.brand ? (
          <p className="mt-1 text-sm text-[var(--muted)]">{drink.brand}</p>
        ) : null}

        {drink.notes ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-6 text-[var(--ink-soft)]">
            {drink.notes}
          </p>
        ) : null}

        <dl className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
          <div>
            <dt className="sr-only">Дата</dt>
            <dd>{formatDate(drink.triedAt)}</dd>
          </div>
          {drink.place ? (
            <div>
              <dt className="sr-only">Місце</dt>
              <dd>{drink.place}</dd>
            </div>
          ) : null}
          {drink.price !== null ? (
            <div>
              <dt className="sr-only">Ціна</dt>
              <dd>{formatPrice(drink.price)}</dd>
            </div>
          ) : null}
        </dl>
      </button>
    </article>
  );
}
