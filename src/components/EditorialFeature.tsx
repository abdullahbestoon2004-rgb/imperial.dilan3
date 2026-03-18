import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ParallaxBanner, Reveal } from './animations';

export function EditorialFeature() {
  return (
    <ParallaxBanner
      imageSrc="/dilanWalking.png"
      imageAlt="Editorial full-screen campaign image"
      heightClassName="min-h-screen"
      imageClassName="object-cover object-[43.5%_center] md:object-center"
      overlayClassName="bg-[linear-gradient(90deg,rgba(14,10,8,0.82)_0%,rgba(14,10,8,0.52)_42%,rgba(14,10,8,0.22)_100%)]"
      className="bg-[#1A1512]"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] items-end px-4 py-10 md:px-6 md:py-14 lg:py-18">
        <Reveal className="max-w-4xl text-left" y={42} amount={0.22}>
          <p className="font-['Inter'] text-[11px] uppercase tracking-[0.4em] text-[#E8D7C4]/80 md:text-xs">
            Editorial Chapter
          </p>
          <h2 className="mt-5 text-[clamp(3.5rem,10vw,8rem)] leading-[0.88] text-[#F6F3EE]">
            A silhouette
            <br />
            that owns the room.
          </h2>
          <p className="mt-6 max-w-xl font-['Inter'] text-base leading-relaxed text-[#F6F3EE]/78 sm:text-lg md:text-xl">
            Strong shoulders, deliberate tailoring, and a full-screen campaign moment that gives the collection some
            space to breathe.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <Link
                to="/new-arrivals"
                className="interactive-button inline-flex items-center justify-center rounded-full bg-[#F6F3EE] px-8 py-3.5 font-['Inter'] text-xs font-medium uppercase tracking-[0.28em] text-[#1A1512] shadow-[0_16px_45px_rgba(0,0,0,0.26)] hover:bg-white"
              >
                View New Arrivals
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <Link
                to="/accessories"
                className="interactive-button inline-flex items-center justify-center rounded-full border border-[#F6F3EE]/45 px-8 py-3.5 font-['Inter'] text-xs font-medium uppercase tracking-[0.28em] text-[#F6F3EE] hover:border-[#F6F3EE] hover:bg-[#F6F3EE]/10"
              >
                Finish The Look
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </ParallaxBanner>
  );
}
