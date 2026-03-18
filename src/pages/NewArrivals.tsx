import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';
import { CategorySidebar } from '../components/CategorySidebar';
import { ParallaxBanner, Reveal } from '../components/animations';

export default function NewArrivals() {
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const selectClassName = "appearance-none bg-[#7A4A2A] border border-[#6E6A66] px-6 py-3 pr-10 font-['Inter'] text-[#E7D7C4] cursor-pointer hover:border-[#D6A25B] transition-colors focus:outline-none focus:border-[#D6A25B]";
  const selectOptionStyle = { backgroundColor: '#1B1411', color: '#E7D7C4' };
  const newArrivalCategoryLabels: Record<string, string> = {
    tailoring: 'New Tailoring',
    footwear: 'New Footwear',
    accessories: 'New Accessories',
    essentials: 'City Essentials',
  };

  const dropCards = [
    {
      id: 'drop-1',
      title: 'Midnight Tailoring',
      subtitle: 'Structured pieces in deep navy and charcoal.',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798977343001_lifestyle?$rl_16x9_zoom$',
    },
    {
      id: 'drop-2',
      title: 'Modern Footwear',
      subtitle: 'Smart hybrids for weekday meetings and weekends.',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437139_lifestyle?$rl_16x9_zoom$',
    },
    {
      id: 'drop-3',
      title: 'Refined Details',
      subtitle: 'Accessories to complete every formal look.',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1458190_lifestyle?$rl_16x9_zoom$',
    },
  ];

  const allNewArrivals = [
    {
      id: 301,
      name: 'Gregory Peak Lapel Suit',
      price: 560,
      color: 'black',
      category: 'tailoring',
      arrivalRank: 1,
      brand: 'Purple Label',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339428_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339428_lifestyle?$rl_4x5_zoom$',
    },
    {
      id: 302,
      name: 'Kent Glen Plaid Jacket',
      price: 470,
      color: 'gray',
      category: 'tailoring',
      arrivalRank: 2,
      brand: 'Purple Label',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798P06876001_alternate10?$rl_4x5_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798P06876001_lifestyle?$rl_4x5_zoom$',
    },
    {
      id: 303,
      name: 'Savile Wholecut Oxford',
      price: 465,
      color: 'red',
      category: 'footwear',
      arrivalRank: 3,
      brand: 'Purple Label',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801964690005_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801964690005_alternate2?$rl_4x5_zoom$',
    },
    {
      id: 304,
      name: 'Westbrook Retro Sneaker',
      price: 219,
      color: 'green',
      category: 'footwear',
      arrivalRank: 4,
      brand: 'Polo Ralph Lauren',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437139_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437139_alternate2?$rl_4x5_zoom$',
    },
    {
      id: 305,
      name: 'Regent Steel Watch',
      price: 510,
      color: 'gray',
      category: 'accessories',
      arrivalRank: 5,
      brand: 'Imperial',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI704950014001_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI704950014001_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 306,
      name: 'West End Leather Duffle',
      price: 580,
      color: 'brown',
      category: 'accessories',
      arrivalRank: 6,
      brand: 'Purple Label',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1458189_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1458189_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 307,
      name: 'Classic Black Suit',
      price: 420,
      color: 'black',
      category: 'essentials',
      arrivalRank: 7,
      brand: 'Polo Ralph Lauren',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199699_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199699_lifestyle?$rl_4x5_zoom$',
    },
    {
      id: 308,
      name: 'Navy Blue Suit',
      price: 450,
      color: 'blue',
      category: 'essentials',
      arrivalRank: 8,
      brand: 'Polo Ralph Lauren',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI715A12700001_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI715A12700001_lifestyle?$rl_4x5_zoom$',
    },
    {
      id: 309,
      name: 'Aviator Sunglasses',
      price: 198,
      color: 'gray',
      category: 'accessories',
      arrivalRank: 9,
      brand: 'Polo Ralph Lauren',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801963330001_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801963330001_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 310,
      name: 'Marina Boat Shoe',
      price: 198,
      color: 'blue',
      category: 'footwear',
      arrivalRank: 10,
      brand: 'Polo Ralph Lauren',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801948867003_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801948867003_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 311,
      name: 'Gregory Wool Serge Blazer',
      price: 380,
      color: 'beige',
      category: 'tailoring',
      arrivalRank: 11,
      brand: 'Purple Label',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339457_alternate10?$rl_4x5_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339457_lifestyle?$rl_4x5_zoom$',
    },
    {
      id: 312,
      name: 'Silk Grenadine Tie',
      price: 98,
      color: 'red',
      category: 'accessories',
      arrivalRank: 12,
      brand: 'Purple Label',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI803963786001_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI803963786001_alternate1?$rl_4x5_zoom$',
    },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All New Arrivals' },
    ...Array.from(new Set(allNewArrivals.map((item) => item.category))).map((category) => ({
      value: category,
      label: newArrivalCategoryLabels[category] ?? category,
    })),
  ];

  let filteredArrivals = allNewArrivals;

  if (selectedCategory !== 'all') {
    filteredArrivals = filteredArrivals.filter((item) => item.category === selectedCategory);
  }

  if (selectedColor !== 'all') {
    filteredArrivals = filteredArrivals.filter((item) => item.color === selectedColor);
  }

  if (selectedPrice !== 'all') {
    if (selectedPrice === 'under200') {
      filteredArrivals = filteredArrivals.filter((item) => item.price < 200);
    } else if (selectedPrice === '200to450') {
      filteredArrivals = filteredArrivals.filter((item) => item.price >= 200 && item.price <= 450);
    } else if (selectedPrice === 'over450') {
      filteredArrivals = filteredArrivals.filter((item) => item.price > 450);
    }
  }

  const sortedArrivals = [...filteredArrivals].sort((a, b) => {
    if (sortBy === 'newest') return a.arrivalRank - b.arrivalRank;
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <ParallaxBanner
        imageSrc="/dilan2.png"
        imageAlt="New arrivals collection"
        eager
        heightClassName="h-[65vh]"
        overlayClassName="bg-gradient-to-b from-[#2F2F2F]/45 via-[#2F2F2F]/55 to-[#2F2F2F]/75"
      >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Inter'] text-sm tracking-[0.24em] text-[#E7D7C4]/85 mb-4"
          >
            SPRING 2026 EDIT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-7xl font-['Playfair_Display'] text-[#F6F3EE] mb-4"
          >
            New Arrivals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#F6F3EE]/80 font-['Inter'] max-w-3xl mx-auto"
          >
            Tailoring, footwear, and accessories curated for sharp days and refined nights.
          </motion.p>
      </ParallaxBanner>

      <section className="py-14 bg-[#E8E1D8]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dropCards.map((drop, index) => (
              <Reveal
                key={drop.id}
                delay={index * 0.08}
                className="h-full"
              >
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="group relative min-h-[230px] overflow-hidden rounded-sm"
                >
                  <img
                    src={drop.image}
                    alt={drop.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2F2F2F]/35 to-[#2F2F2F]/72" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <p className="font-['Inter'] text-xs tracking-[0.2em] text-[#E7D7C4]/80">THE DROP</p>
                    <h2 className="mt-2 font-['Playfair_Display'] text-3xl text-[#F6F3EE]">{drop.title}</h2>
                    <p className="mt-2 font-['Inter'] text-sm text-[#F6F3EE]/78">{drop.subtitle}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#E8E1D8]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6">
          <div className="rounded-sm border border-[#6E6A66]/35 bg-[#F1EBE2] px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="font-['Inter'] text-sm tracking-[0.06em] text-[#2F2F2F]">
              New drops are released weekly. Save favorites with the heart and add to cart when ready.
            </p>
            <span className="font-['Inter'] text-xs tracking-[0.16em] text-[#6E6A66]">UPDATED WEEKLY</span>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-[#E8E1D8]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:w-60 lg:shrink-0">
              <CategorySidebar
                title="New Category"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)} className={selectClassName}>
                      <option style={selectOptionStyle} value="all">All Colors</option>
                      <option style={selectOptionStyle} value="black">Black</option>
                      <option style={selectOptionStyle} value="blue">Blue</option>
                      <option style={selectOptionStyle} value="gray">Gray</option>
                      <option style={selectOptionStyle} value="beige">Beige</option>
                      <option style={selectOptionStyle} value="brown">Brown</option>
                      <option style={selectOptionStyle} value="green">Green</option>
                      <option style={selectOptionStyle} value="red">Red</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select value={selectedPrice} onChange={(event) => setSelectedPrice(event.target.value)} className={selectClassName}>
                      <option style={selectOptionStyle} value="all">All Prices</option>
                      <option style={selectOptionStyle} value="under200">Under $200</option>
                      <option style={selectOptionStyle} value="200to450">$200 - $450</option>
                      <option style={selectOptionStyle} value="over450">Over $450</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A66] font-['Inter'] text-sm">Sort by:</span>
                  <div className="relative">
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClassName}>
                      <option style={selectOptionStyle} value="newest">Newest</option>
                      <option style={selectOptionStyle} value="priceLow">Price: Low to High</option>
                      <option style={selectOptionStyle} value="priceHigh">Price: High to Low</option>
                      <option style={selectOptionStyle} value="name">Name</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>
                </div>
              </div>

              <p className="text-[#6E6A66] font-['Inter'] mb-8">
                {sortedArrivals.length} {sortedArrivals.length === 1 ? 'new item' : 'new items'} found
              </p>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-[2px] gap-y-10">
                {sortedArrivals.map((item, index) => (
                  <ProductCard key={item.id} product={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
