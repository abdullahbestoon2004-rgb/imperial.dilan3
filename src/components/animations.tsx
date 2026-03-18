import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  y?: number;
}>;

type MotionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

type ParallaxBannerProps = {
  imageSrc: string;
  imageAlt: string;
  heightClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  className?: string;
  eager?: boolean;
  children: ReactNode;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  y = 26,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduceMotion ? 0.01 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionButton({ className = '', children, ...props }: MotionButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`interactive-button ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function ParallaxBanner({
  imageSrc,
  imageAlt,
  heightClassName = 'h-[60vh]',
  imageClassName = 'object-cover object-center',
  overlayClassName = 'bg-gradient-to-b from-[#2F2F2F]/50 to-[#2F2F2F]/70',
  className = 'bg-[#E8E1D8]',
  eager = false,
  children,
}: ParallaxBannerProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-18%', '18%']);

  return (
    <section ref={ref} className={`relative flex items-center justify-center overflow-hidden ${heightClassName} ${className}`.trim()}>
      <motion.img
        src={imageSrc}
        alt={imageAlt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        style={{ y, scale: reduceMotion ? 1 : 1.14 }}
        className={`absolute top-0 left-1/2 h-full w-full max-w-[1935px] -translate-x-1/2 will-change-transform ${imageClassName}`.trim()}
      />
      <div className={`absolute top-0 left-1/2 h-full w-full max-w-[1935px] -translate-x-1/2 ${overlayClassName}`.trim()} />
      <div className="relative z-10 px-6 text-center">{children}</div>
    </section>
  );
}
