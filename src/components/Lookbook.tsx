import { ImageWithFallback } from './figma/ImageWithFallback';
import { MotionButton, Reveal } from './animations';

interface LookbookImage {
  image: string;
  title: string;
}

interface LookbookProps {
  images: LookbookImage[];
}

export function Lookbook({ images }: LookbookProps) {
  return (
    <section className="py-20 bg-[#2F2F2F]">
      <div className="container mx-auto px-6">
        <Reveal className="mb-4">
          <h2 className="text-5xl font-['Playfair_Display'] text-center text-[#F6F3EE]">
            Style Inspiration
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mb-16">
          <p className="text-center text-[#F6F3EE]/70 font-['Inter']">
            Curated looks for the modern gentleman
          </p>
        </Reveal>

        <div className="mb-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {images.map((item, index) => (
            <Reveal
              key={index}
              delay={index * 0.08}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-[3/4] relative">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F2F2F]/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-lg font-['Playfair_Display'] text-[#F6F3EE] sm:text-2xl">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <MotionButton className="px-8 py-4 border-2 border-[#F6F3EE] text-[#F6F3EE] font-['Inter'] font-medium hover:bg-[#F6F3EE] hover:text-[#2F2F2F]">
            View Lookbook
          </MotionButton>
        </Reveal>
      </div>
    </section>
  );
}

