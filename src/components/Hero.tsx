import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ParallaxBanner } from './animations';

interface HeroProps {
  heroImage: string;
}

export function Hero({ heroImage }: HeroProps) {
  return (
    <ParallaxBanner
      imageSrc={heroImage}
      imageAlt="Elegant man in suit"
      eager
      heightClassName="h-screen"
      imageClassName="object-cover object-left"
      overlayClassName="bg-[#171310]/58"
    >
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center">
        <div className="text-center">
          <motion.img
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            src="/imperial-logo.png"
            alt="Imperial logo"
            className="mx-auto mb-6 h-16 w-auto md:h-20 lg:h-100"
          />
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-6xl font-['Playfair_Display'] text-[#F6F3EE] md:text-7xl lg:text-8xl"
          >
            Timeless Elegance
            <br />
            Modern Tailoring
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-xl font-['Inter'] font-light text-[#F6F3EE]/90 md:text-2xl"
          >
            Discover premium suits crafted for the modern gentleman.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/new-arrivals"
              className="interactive-button inline-flex items-center justify-center rounded-full bg-[#f3eee7] px-10 py-4 font-['Inter'] text-sm font-medium uppercase tracking-[0.22em] text-[#1a1512] shadow-[0_18px_50px_rgba(0,0,0,0.28)] hover:bg-white"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </ParallaxBanner>
  );
}
