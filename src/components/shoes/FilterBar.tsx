import { SlidersHorizontal } from 'lucide-react';
import { SortOption } from './types';

interface FilterBarProps {
  activeCategory: string;
  categories: string[];
  totalResults: number;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  onOpenFilters: () => void;
  onCategoryChange: (category: string) => void;
}

const sortLabels: Record<SortOption, string> = {
  recommended: 'Recommended',
  'new-arrivals': 'New Arrivals',
  'best-sellers': 'Best Sellers',
  'price-low-high': 'Price Low to High',
  'price-high-low': 'Price High to Low',
};

export function FilterBar({
  activeCategory,
  categories,
  totalResults,
  sortBy,
  onSortChange,
  onOpenFilters,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-6 md:px-8">
      <div className="flex flex-col gap-4 border-y border-[#6E6A66]/45 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenFilters}
              className="inline-flex items-center gap-2 rounded-full border border-[#6E6A66] px-4 py-2 font-['Inter'] text-xs tracking-[0.18em] text-[#E7D7C4] transition-colors hover:border-[#D6A25B] hover:text-[#D6A25B]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              FILTERS
            </button>
            <span className="font-['Inter'] text-sm text-[#E7D7C4]/65">{totalResults} products</span>
          </div>

          <div className="hidden flex-wrap gap-2 md:flex">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-full border px-4 py-1.5 font-['Inter'] text-xs tracking-[0.16em] transition-colors ${
                    isActive
                      ? 'border-[#D6A25B] bg-[#D6A25B]/10 text-[#D6A25B]'
                      : 'border-[#6E6A66]/65 text-[#E7D7C4]/70 hover:border-[#D6A25B]/80 hover:text-[#E7D7C4]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 self-start font-['Inter'] text-xs tracking-[0.16em] text-[#E7D7C4]/70 lg:self-center">
          SORT BY
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="rounded-full border border-[#6E6A66] bg-[#3A2418] px-4 py-2 pr-10 text-xs tracking-[0.16em] text-[#E7D7C4] outline-none transition-colors hover:border-[#D6A25B] focus:border-[#D6A25B]"
          >
            <option value="recommended">{sortLabels.recommended}</option>
            <option value="new-arrivals">{sortLabels['new-arrivals']}</option>
            <option value="best-sellers">{sortLabels['best-sellers']}</option>
            <option value="price-low-high">{sortLabels['price-low-high']}</option>
            <option value="price-high-low">{sortLabels['price-high-low']}</option>
          </select>
        </label>
      </div>
    </section>
  );
}