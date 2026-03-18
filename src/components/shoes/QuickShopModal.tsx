import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { ShoeProduct } from './types';
import { useCart } from '../../context/CartContext';

interface QuickShopModalProps {
  product: ShoeProduct | null;
  onClose: () => void;
}

export function QuickShopModal({ product, onClose }: QuickShopModalProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (!product) {
      return;
    }

    setSelectedColor(product.colors[0] ?? '');
    setSelectedSize(product.sizes[0] ?? '');
  }, [product]);

  const colorChoices = useMemo(() => product?.colors ?? [], [product]);
  const sizeChoices = useMemo(() => product?.sizes ?? [], [product]);

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm md:items-center md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[880px] rounded-t-3xl border border-[#6E6A66]/45 bg-[#1B1411] p-5 md:rounded-3xl md:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="font-['Inter'] text-[11px] uppercase tracking-[0.22em] text-[#E7D7C4]/60">{product.brand}</p>
                <h3 className="mt-2 font-['Playfair_Display'] text-3xl text-[#E7D7C4]">{product.name}</h3>
                <p className="mt-2 font-['Inter'] text-lg text-[#E7D7C4]">${product.price}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-[#6E6A66] p-2 text-[#E7D7C4] transition-colors hover:border-[#D6A25B] hover:text-[#D6A25B]"
                onClick={onClose}
                aria-label="Close quick shop"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.05fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-[#6E6A66]/40 bg-[#3A2418]">
                <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-['Inter'] text-xs tracking-[0.2em] text-[#E7D7C4]/65">COLOR</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {colorChoices.map((color) => {
                      const selected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`h-8 w-8 rounded-full border transition ${
                            selected ? 'border-[#D6A25B] ring-1 ring-[#D6A25B]' : 'border-[#E7D7C4]/35'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="font-['Inter'] text-xs tracking-[0.2em] text-[#E7D7C4]/65">SIZE</p>
                  <div className="mt-3 grid grid-cols-4 gap-2.5">
                    {sizeChoices.map((size) => {
                      const selected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-lg border px-0 py-2 font-['Inter'] text-sm transition ${
                            selected
                              ? 'border-[#D6A25B] bg-[#D6A25B]/15 text-[#D6A25B]'
                              : 'border-[#6E6A66] text-[#E7D7C4] hover:border-[#D6A25B]/70'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      imageHover: product.image,
                      brand: product.brand,
                      colors: product.colors,
                    });
                    onClose();
                  }}
                  className="w-full rounded-full bg-[#D6A25B] px-6 py-3 font-['Inter'] text-sm tracking-[0.16em] text-[#0E0E0E] transition-colors hover:bg-[#E7D7C4]"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
