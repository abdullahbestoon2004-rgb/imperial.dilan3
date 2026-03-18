interface CategoryOption {
  value: string;
  label: string;
}

interface CategorySidebarProps {
  title: string;
  options: CategoryOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export function CategorySidebar({
  title,
  options,
  selectedValue,
  onChange,
}: CategorySidebarProps) {
  return (
    <aside className="rounded-sm border border-[#6E6A66]/35 bg-[#F1EBE2] p-6">
      <h2 className="text-sm font-['Inter'] tracking-[0.22em] text-[#2F2F2F] uppercase">{title}</h2>

      <div className="mt-5 space-y-1">
        {options.map((option) => {
          const isActive = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors ${
                isActive ? 'bg-[#D6A25B]/15 text-[#2F2F2F]' : 'text-[#4F4A45] hover:bg-[#D6A25B]/8'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full border transition-colors ${
                  isActive ? 'border-[#B67A2D] bg-[#B67A2D]' : 'border-[#6E6A66]'
                }`}
              />
              <span className="font-['Inter'] text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
