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
    <section className="py-20 bg-[#F8F8F8]">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-['Playfair_Display'] text-center text-[#0B0B0B] mb-16"
        >
          What Our Clients Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C6A96B] text-[#C6A96B]" />
                ))}
              </div>
              <p className="text-[#0B0B0B] font-['Inter'] mb-6 italic">
                "{testimonial.text}"
              </p>
              <h4 className="font-['Playfair_Display'] text-[#0B0B0B] text-lg mb-1">
                {testimonial.name}
              </h4>
              <p className="text-[#666] font-['Inter'] text-sm">
                {testimonial.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
