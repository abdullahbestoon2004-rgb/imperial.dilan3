import { motion } from 'motion/react';

interface CategoryHeaderProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryHeader({ categories, activeCategory, onCategoryChange }: CategoryHeaderProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 pt-32 md:px-8 md:pt-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-['Playfair_Display'] text-4xl text-[#E7D7C4] md:text-5xl">Men's Shoes</h1>
        <p className="mt-4 max-w-3xl font-['Inter'] text-base text-[#E7D7C4]/75 md:text-lg">
          Footwear designed with attention to craftsmanship and timeless style.
        </p>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`font-['Inter'] text-sm tracking-[0.2em] transition-colors md:text-[13px] ${
                isActive ? 'text-[#D6A25B]' : 'text-[#E7D7C4]/70 hover:text-[#E7D7C4]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </motion.nav>
    </section>
  );
}