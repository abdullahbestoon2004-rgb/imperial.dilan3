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
      overlayClassName="bg-[linear-gradient(100deg,rgba(23,19,16,0.82)_0%,rgba(23,19,16,0.58)_38%,rgba(23,19,16,0.2)_100%)]"
      contentClassName="relative z-10 w-full"
    >
      <motion.img
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        src="/imperial-logo.png"
        alt="Imperial logo"
        className="pointer-events-none absolute left-1/2 top-[25%] z-0 h-44 w-auto -translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-[0_20px_55px_rgba(0,0,0,0.28)] md:h-56 lg:h-72 xl:h-80"
      />
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] items-end justify-start px-4 pb-10 pt-28 md:px-6 md:pb-14 lg:pb-18">
        <div className="relative z-10 mr-auto w-full max-w-[58rem] text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-5 font-['Inter'] text-[11px] uppercase tracking-[0.42em] text-[#E8D7C4]/82 md:text-xs"
          >
            Imperial Tailoring House
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl text-[clamp(4.1rem,13vw,10.5rem)] leading-[0.86] tracking-[-0.055em] text-[#F6F3EE]"
          >
            Dress For
            <br />
            The Entrance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed font-['Inter'] font-light text-[#F6F3EE]/84 sm:text-lg md:text-xl"
          >
            Architecture in wool, silk, and linen for evenings that demand presence before a word is spoken.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <Link
                to="/new-arrivals"
                className="interactive-button inline-flex items-center justify-center rounded-full bg-[#f3eee7] px-8 py-3.5 font-['Inter'] text-xs font-medium uppercase tracking-[0.28em] text-[#1a1512] shadow-[0_18px_50px_rgba(0,0,0,0.28)] hover:bg-white sm:px-10 sm:py-4"
              >
                Shop The Edit
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <Link
                to="/suits"
                className="interactive-button inline-flex items-center justify-center rounded-full border border-[#F6F3EE]/55 px-8 py-3.5 font-['Inter'] text-xs font-medium uppercase tracking-[0.28em] text-[#F6F3EE] backdrop-blur-sm hover:border-[#F6F3EE] hover:bg-[#F6F3EE]/10 sm:px-10 sm:py-4"
              >
                Explore Tailoring
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ParallaxBanner>
  );
}
