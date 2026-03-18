import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    setShowLoader(true);
    const timer = window.setTimeout(() => {
      setShowLoader(false);
    }, 520);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <div className="page-shell overflow-x-hidden bg-[#E8E1D8] font-['Inter']">
      <AnimatePresence>
        {showLoader ? (
          <motion.div
            key={location.pathname}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="page-loader fixed top-0 left-0 z-[70] h-[3px] w-full"
          />
        ) : null}
      </AnimatePresence>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
