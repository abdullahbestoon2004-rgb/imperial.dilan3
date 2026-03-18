import { MotionButton, Reveal } from './animations';

export function Newsletter() {
  return (
    <section className="py-20 bg-[#E8E1D8]">
      <div className="container mx-auto px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] text-[#2F2F2F] mb-4">
            Join the Gentleman Club
          </h2>
          <p className="text-[#2D332B] font-['Inter'] mb-8">
            Get exclusive updates on new collections, special offers, and style tips.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-[#F6F3EE] text-[#2F2F2F] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#2D332B]"
            />
            <MotionButton
              type="submit"
              className="px-8 py-4 bg-[#2D332B] text-[#F6F3EE] font-['Inter'] font-medium hover:bg-[#F6F3EE] hover:text-[#2F2F2F]"
            >
              Subscribe
            </MotionButton>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
