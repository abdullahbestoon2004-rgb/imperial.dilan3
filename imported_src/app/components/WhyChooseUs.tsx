import { motion } from 'motion/react';
import { Scissors, Package, RotateCcw, Award } from 'lucide-react';

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
    <section className="py-20 bg-[#FFFFFF]">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-['Playfair_Display'] text-center text-[#0B0B0B] mb-16"
        >
          Why Choose Us
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border-2 border-[#C6A96B] rounded-full">
                  <Icon className="w-8 h-8 text-[#C6A96B]" />
                </div>
                <h3 className="text-xl font-['Playfair_Display'] text-[#0B0B0B] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#666] font-['Inter']">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
