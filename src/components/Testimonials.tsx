import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'James Mitchell',
    role: 'CEO',
    text: 'Best suit I\'ve ever owned. The quality and fit are absolutely perfect.',
    rating: 5
  },
  {
    name: 'Robert Chen',
    role: 'Entrepreneur',
    text: 'Outstanding craftsmanship. I receive compliments every time I wear it.',
    rating: 5
  },
  {
    name: 'David Thompson',
    role: 'Lawyer',
    text: 'Exceptional service and premium quality. Worth every penny.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#E8E1D8]">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-['Playfair_Display'] text-center text-[#2F2F2F] mb-16"
        >
          What Our Clients Say
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#B68B63] p-5 text-center sm:p-8"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#2D332B] text-[#2D332B]" />
                ))}
              </div>
              <p className="mb-6 text-sm italic text-[#F6F3EE] font-['Inter'] sm:text-base">
                "{testimonial.text}"
              </p>
              <h4 className="mb-1 text-base font-['Playfair_Display'] text-[#F6F3EE] sm:text-lg">
                {testimonial.name}
              </h4>
              <p className="text-[#F6F3EE]/70 font-['Inter'] text-sm">
                {testimonial.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

