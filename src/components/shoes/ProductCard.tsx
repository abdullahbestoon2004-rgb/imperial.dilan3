import { ShoeProduct } from './types';

interface ProductCardProps {
  product: ShoeProduct;
  onQuickShop: (product: ShoeProduct) => void;
}

export function ProductCard({ product, onQuickShop }: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-[#6E6A66]/35 bg-[#3A2418] p-3 transition-all duration-300 hover:shadow-[0_20px_35px_rgba(0,0,0,0.32)]">
      <div className="relative overflow-hidden rounded-2xl bg-[#1B1411]">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <button
          type="button"
          onClick={() => onQuickShop(product)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-5 rounded-full border border-[#D6A25B] bg-[#1B1411]/90 px-5 py-2 font-['Inter'] text-[11px] tracking-[0.16em] text-[#E7D7C4] opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#D6A25B] hover:text-[#0E0E0E] group-hover:translate-y-0 group-hover:opacity-100"
        >
          QUICK SHOP
        </button>
      </div>

      <div className="px-1 pb-2 pt-5">
        <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#E7D7C4]/60">{product.brand}</p>
        <h3 className="mt-2 font-['Playfair_Display'] text-[23px] leading-tight text-[#E7D7C4]">{product.name}</h3>

        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="font-['Inter'] text-lg text-[#E7D7C4]">${product.price}</p>
          <div className="flex items-center gap-1.5" aria-label={`${product.colors.length} available colors`}>
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={`${product.id}-${color}`}
                className="h-3.5 w-3.5 rounded-full border border-[#E7D7C4]/35"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}