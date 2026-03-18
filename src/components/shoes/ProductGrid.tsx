import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { ShoeProduct } from './types';

interface ProductGridProps {
  products: ShoeProduct[];
  onQuickShop: (product: ShoeProduct) => void;
}

export function ProductGrid({ products, onQuickShop }: ProductGridProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 md:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 xl:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
          >
            <ProductCard product={product} onQuickShop={onQuickShop} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}