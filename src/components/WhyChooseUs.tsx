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
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border-2 border-[#2D332B] rounded-full">
                  <Icon className="w-8 h-8 text-[#2D332B]" />
                </div>
                <h3 className="mb-2 text-lg font-['Playfair_Display'] text-[#2F2F2F] sm:text-xl">
                  {feature.title}
                </h3>
                <p className="text-[#2D332B] font-['Inter']">
                  {feature.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
