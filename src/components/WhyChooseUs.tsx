import { motion } from 'motion/react';
import { Scissors, Package, RotateCcw, Award } from 'lucide-react';
import { Reveal } from './animations';

const features = [
  {
    icon: Award,
    title: 'Premium Fabrics',
    description: 'Only the finest materials from Italy and England'
  },
  {
    icon: Scissors,
    title: 'Perfect Tailoring',
    description: 'Expert craftsmanship for a flawless fit'
  },
  {
    icon: Package,
    title: 'Worldwide Shipping',
    description: 'Free express delivery on all orders'
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Easy returns and exchanges guaranteed'
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#E8E1D8]">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16">
          <h2 className="text-5xl font-['Playfair_Display'] text-center text-[#2F2F2F]">
            Why Choose Us
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-6 sm:gap-12 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={feature.title}
                delay={index * 0.08}
                className="text-center"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[28px] border border-[#B68B63]/18 bg-[#F6F3EE]/45 px-5 py-8 shadow-[0_12px_30px_rgba(47,47,47,0.04)]"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#2D332B]">
                    <Icon className="h-8 w-8 text-[#2D332B]" />
                  </div>
                  <h3 className="mb-2 mt-4 text-lg font-['Playfair_Display'] text-[#2F2F2F] sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="font-['Inter'] text-[#2D332B]">
                    {feature.description}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
