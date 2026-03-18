import { motion } from 'motion/react';

export function Newsletter() {
  return (
    <section className="py-20 bg-[#1A1A1A]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] text-white mb-4">
            Join the Gentleman Club
          </h2>
          <p className="text-white/70 font-['Inter'] mb-8">
            Get exclusive updates on new collections, special offers, and style tips.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white text-[#0B0B0B] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#C6A96B] text-white font-['Inter'] font-medium hover:bg-[#B39860] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
