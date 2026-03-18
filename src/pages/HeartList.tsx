import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';
import { useWishlist } from '../context/WishlistContext';
import { MotionButton, Reveal } from '../components/animations';

export default function HeartList() {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();

  return (
    <>
      <section className="relative h-[45vh] bg-[#2F2F2F] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2F2F2F]/50 to-[#2F2F2F]/70" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-['Playfair_Display'] text-[#F6F3EE] mb-4"
          >
            Heart List
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-[#F6F3EE]/80 font-['Inter']"
          >
            Save items now and watch them later.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-[#E8E1D8]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#6E6A66] font-['Inter']">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
            </p>

            {wishlistCount > 0 ? (
              <MotionButton
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6E6A66] px-5 py-2 font-['Inter'] text-sm text-[#2F2F2F] hover:border-[#B67A2D] hover:text-[#B67A2D]"
              >
                <Heart className="h-4 w-4" />
                Clear Heart List
              </MotionButton>
            ) : null}
          </div>

          {wishlistCount === 0 ? (
            <Reveal className="rounded-sm border border-[#6E6A66]/35 bg-[#F1EBE2] px-6 py-16 text-center">
              <h2 className="text-3xl font-['Playfair_Display'] text-[#2F2F2F] mb-3">Your heart list is empty</h2>
              <p className="text-[#6E6A66] font-['Inter'] mb-8">Tap the heart icon on any product to save it.</p>
              <Link
                to="/suits"
                className="interactive-button inline-flex items-center justify-center rounded-full bg-[#3A2418] px-6 py-3 font-['Inter'] text-sm tracking-[0.14em] text-[#E7D7C4] hover:bg-[#4A2F20]"
              >
                BROWSE PRODUCTS
              </Link>
            </Reveal>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-[2px] gap-y-10">
              {wishlistItems.map((product, index) => (
                <ProductCard key={product.wishlistKey} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
