import { useState } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  imageHover: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#E5E5E5]">
        <ImageWithFallback
          src={isHovered ? product.imageHover : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Quick Add to Cart Button */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <button className="w-full bg-[#0B0B0B] text-white py-3 font-['Inter'] hover:bg-[#C6A96B] transition-colors">
            Quick Add to Cart
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-['Inter'] text-[#0B0B0B] mb-2">{product.name}</h3>
      <p className="text-xl font-['Playfair_Display'] text-[#C6A96B]">${product.price}</p>
    </motion.div>
  );
}
