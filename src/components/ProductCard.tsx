import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { MotionButton } from './animations';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  imageHover: string;
  brand?: string;
  color?: string;
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const colorMap: Record<string, string[]> = {
  black: ['#0F172A', '#3F3F46'],
  blue: ['#1D4ED8', '#93C5FD'],
  gray: ['#4B5563', '#D1D5DB'],
  beige: ['#D6C2A1', '#F4E8D2'],
  brown: ['#7C4A2D', '#C08A5B'],
  green: ['#3F5D47', '#A3B18A'],
  red: ['#6B1A1A', '#D97777'],
};

const defaultSwatches = ['#0F172A', '#D1D5DB'];

export function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isSaved = isWishlisted(product);
  const swatches =
    product.colors?.length
      ? product.colors
      : product.color && colorMap[product.color]
        ? colorMap[product.color]
        : defaultSwatches;

  return (
    <motion.div
      initial={{ opacity: 0, y: 42, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.78,
        delay: index * 0.055,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-[#E8E1D8]">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <ImageWithFallback
          src={product.imageHover}
          alt={`${product.name} alternate view`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#2D332B]/95 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              {swatches.slice(0, 3).map((color, swatchIndex) => (
                <span
                  key={`${product.id}-${color}-${swatchIndex}`}
                  className="h-4 w-4 rounded-full border border-[#B68B63]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <MotionButton
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-full border border-[#F6F3EE] px-4 py-1.5 text-[10px] font-['Inter'] tracking-[0.2em] text-[#F6F3EE] hover:bg-[#F6F3EE] hover:text-[#2D332B]"
            >
              ADD TO CART
            </MotionButton>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-xl font-['Playfair_Display'] text-[#2F2F2F] leading-tight">{product.name}</h3>
          <p className="text-sm text-[#2D332B] font-['Inter'] mt-1">{product.brand ?? 'Polo Ralph Lauren'}</p>
        </div>
        <button
          type="button"
          aria-label={`${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} heart list`}
          onClick={() => toggleWishlist(product)}
          className={`mt-1 shrink-0 -translate-x-[4px] transition-colors ${
            isSaved ? 'text-[#B67A2D]' : 'text-[#2D332B] hover:text-[#2F2F2F]'
          }`}
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-[#B67A2D]' : ''}`} />
        </button>
      </div>

      <p className="text-xl font-['Playfair_Display'] text-[#2F2F2F]">${product.price.toFixed(2)}</p>
      <p className="text-sm text-[#2D332B] font-['Inter'] mt-2">{swatches.length} colors available</p>
    </motion.div>
  );
}
