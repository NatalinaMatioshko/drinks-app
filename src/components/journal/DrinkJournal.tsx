"use client";

import { useMemo, useState } from "react";
import { DrinkCard } from "@/components/journal/DrinkCard";
import { DrinkForm } from "@/components/journal/DrinkForm";
import { sortDrinks, useDrinks } from "@/hooks/useDrinks";
import { formatPrice } from "@/lib/format";
import { CATEGORIES, type CategoryId, type Drink, type DrinkDraft, type SortId } from "@/lib/types";

export function DrinkJournal() {
  const { drinks, stats, addDrink, updateDrink, removeDrink } = useDrinks();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<SortId>("newest");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Drink | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = drinks.filter((drink) => {
      const matchesCategory = category === "all" || drink.category === category;
      const haystack = `${drink.name} ${drink.brand} ${drink.place} ${drink.notes}`.toLowerCase();
      const matchesQuery = needle.length === 0 || haystack.includes(needle);
      return matchesCategory && matchesQuery;
    });
    return sortDrinks(filtered, sort);
  }, [drinks, query, category, sort]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(drink: Drink) {
    setEditing(drink);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function handleSave(draft: DrinkDraft) {
    if (editing) {
      updateDrink(editing.id, draft);
    } else {
      addDrink(draft);
    }
    closeForm();
  }

  function handleDelete() {
    if (!editing) return;
    const confirmed = window.confirm(`Видалити «${editing.name}» з журналу?`);
    if (!confirmed) return;
    removeDrink(editing.id);
    closeForm();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-medium tracking-[0.22em] text-[var(--muted)] uppercase">
            Особистий журнал
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
            Напої, які ми спробували
          </h1>
          <p className="mt-3 max-w-md text-[var(--ink-soft)]">
            Облік смаку, ціни й вражень — щоб пам’ятати, що варте повтору.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="self-start rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-ink)] shadow-[0_10px_24px_rgba(196,106,43,0.28)] hover:opacity-90"
        >
          Додати напій
        </button>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Спробувано" value={String(stats.count)} />
        <Stat
          label="Середня оцінка"
          value={
            stats.count > 0 ? stats.averageRating.toFixed(1).replace(".", ",") : "—"
          }
        />
        <Stat
          label="Витрачено"
          value={stats.pricedCount > 0 ? formatPrice(stats.spent) : "—"}
        />
      </section>

      <section className="mb-6 flex flex-col gap-3 lg:flex-row">
        <label className="block flex-1">
          <span className="sr-only">Пошук</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Пошук за назвою, місцем чи нотатками"
            className="field-input"
          />
        </label>
        <label>
          <span className="sr-only">Категорія</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryId | "all")}
            className="field-input lg:w-48"
          >
            <option value="all">Усі категорії</option>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Сортування</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            className="field-input lg:w-48"
          >
            <option value="newest">Спочатку нові</option>
            <option value="rating">За оцінкою</option>
            <option value="price">За ціною</option>
          </select>
        </label>
      </section>

      {visible.length === 0 ? (
        <EmptyState hasDrinks={drinks.length > 0} onAdd={openCreate} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} onEdit={openEdit} />
          ))}
        </div>
      )}

      {formOpen ? (
        <DrinkForm
          key={editing?.id ?? "new"}
          drink={editing}
          onClose={closeForm}
          onSave={handleSave}
          onDelete={editing ? handleDelete : undefined}
        />
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--foam)] px-5 py-4">
      <p className="text-xs tracking-[0.16em] text-[var(--muted)] uppercase">{label}</p>
      <p className="mt-1 font-serif text-3xl text-[var(--ink)]">{value}</p>
    </div>
  );
}

function EmptyState({
  hasDrinks,
  onAdd,
}: {
  hasDrinks: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--line-strong)] bg-[var(--foam)] px-6 py-16 text-center">
      <p className="font-serif text-2xl text-[var(--ink)]">
        {hasDrinks ? "Нічого не знайдено" : "Журнал ще порожній"}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[var(--muted)]">
        {hasDrinks
          ? "Спробуйте іншу категорію або змініть пошук."
          : "Додайте перший напій: назву, смак і ціну — і історія спроб почне збиратися тут."}
      </p>
      {hasDrinks ? null : (
        <button
          type="button"
          onClick={onAdd}
          className="mt-6 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-ink)]"
        >
          Записати перший напій
        </button>
      )}
    </div>
  );
}
