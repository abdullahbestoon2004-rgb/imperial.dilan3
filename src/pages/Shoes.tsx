import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';
import { CategorySidebar } from '../components/CategorySidebar';
import { ParallaxBanner } from '../components/animations';

export default function Shoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');

  const selectClassName = "appearance-none bg-[#7A4A2A] border border-[#6E6A66] px-6 py-3 pr-10 font-['Inter'] text-[#E7D7C4] cursor-pointer hover:border-[#D6A25B] transition-colors focus:outline-none focus:border-[#D6A25B]";
  const selectOptionStyle = { backgroundColor: '#1B1411', color: '#E7D7C4' };
  const styleCategoryLabels: Record<string, string> = {
    sneakers: 'Sneakers',
    loafers: 'Loafers',
    dress: 'Dress Shoes',
    boots: 'Boots',
    sandals: 'Sandals',
    drivers: 'Drivers & Boat Shoes',
  };

  const allShoes = [
    {
      id: 101,
      name: 'Darnell Calf Monk-Strap Shoe',
      price: 248,
      color: 'black',
      brand: 'Polo Ralph Lauren',
      style: 'sneakers',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1183688_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1183688_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 102,
      name: 'Darnell Calf Monk-Strap Shoe',
      price: 398,
      color: 'brown',
      brand: 'Purple Label',
      style: 'loafers',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1169846_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1183688_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 103,
      name: 'Meegan Penny Loafer',
      price: 315,
      color: 'black',
      brand: 'Polo Ralph Lauren',
      style: 'dress',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1313643_lifestyle?$rl_1x1_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1313643_lifestyle?$rl_1x1_pdp$',
    },
    {
      id: 104,
      name: 'Meegan Penny Loafer',
      price: 315,
      color: 'black',
      brand: 'Polo Ralph Lauren',
      style: 'dress',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1419542_lifestyle?$rl_1x1_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1419542_alternate2?$rl_4x5_zoom$',
    },
    {
      id: 105,
      name: 'Southport Leather Sandal',
      price: 182,
      color: 'beige',
      brand: 'Polo Ralph Lauren',
      style: 'sandals',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI811967542001_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI811967542001_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 106,
      name: 'Hudson Suede Driver',
      price: 286,
      color: 'blue',
      brand: 'Purple Label',
      style: 'drivers',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1323019_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1323019_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 107,
      name: 'Westbrook Retro Sneaker',
      price: 219,
      color: 'green',
      brand: 'Polo Ralph Lauren',
      style: 'sneakers',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437139_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437139_alternate2?$rl_4x5_zoom$',
    },
    {
      id: 108,
      name: 'Pimlico Penny Loafer',
      price: 332,
      color: 'gray',
      brand: 'Polo Ralph Lauren',
      style: 'loafers',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1502538_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1502538_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 109,
      name: 'Savile Wholecut Oxford',
      price: 465,
      color: 'red',
      brand: 'Purple Label',
      style: 'dress',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801964690005_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801964690005_alternate2?$rl_4x5_zoom$',
    },
    {
      id: 110,
      name: 'Alden Rugged Chelsea Boot',
      price: 389,
      color: 'black',
      brand: 'Polo Ralph Lauren',
      style: 'boots',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437140_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1437140_alternate2?$rl_4x5_zoom$',
    },
    {
      id: 111,
      name: 'Marina Boat Shoe',
      price: 198,
      color: 'blue',
      brand: 'Polo Ralph Lauren',
      style: 'drivers',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801948867003_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI801948867003_alternate1?$rl_4x5_zoom$',
    },
    {
      id: 112,
      name: 'Riviera Cross-Strap Sandal',
      price: 176,
      color: 'beige',
      brand: 'Polo Ralph Lauren',
      style: 'sandals',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1333527_lifestyle?$rl_1x1_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1333527_alternate1?$rl_4x5_zoom$',
    },
  ];
  const categoryOptions = [
    { value: 'all', label: 'All Shoes' },
    ...Array.from(new Set(allShoes.map((shoe) => shoe.style))).map((style) => ({
      value: style,
      label: styleCategoryLabels[style] ?? style,
    })),
  ];
  const categoryValues = new Set(categoryOptions.map((option) => option.value));

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') ?? 'all';
    const normalizedCategory = categoryValues.has(categoryFromUrl) ? categoryFromUrl : 'all';

    if (normalizedCategory !== selectedCategory) {
      setSelectedCategory(normalizedCategory);
    }
  }, [searchParams, selectedCategory, categoryValues]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', value);
    }

    setSearchParams(nextParams);
  };

  let filteredShoes = allShoes;

  if (selectedCategory !== 'all') {
    filteredShoes = filteredShoes.filter((shoe) => shoe.style === selectedCategory);
  }

  if (selectedColor !== 'all') {
    filteredShoes = filteredShoes.filter((shoe) => shoe.color === selectedColor);
  }

  const sortedShoes = [...filteredShoes].sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <ParallaxBanner
        imageSrc="/shoebackground.png"
        imageAlt="Premium shoes"
        eager
      >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-['Playfair_Display'] text-[#F6F3EE] mb-4"
          >
            Premium Shoes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#F6F3EE]/80 font-['Inter']"
          >
            Refined footwear for every moment, from boardroom to weekend.
          </motion.p>
      </ParallaxBanner>

      <section className="py-16 bg-[#E8E1D8]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:w-60 lg:shrink-0">
              <CategorySidebar
                title="Category"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className={selectClassName}>
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
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A66] font-['Inter'] text-sm">Sort by:</span>
                  <div className="relative">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClassName}>
                      <option style={selectOptionStyle} value="featured">Featured</option>
                      <option style={selectOptionStyle} value="priceLow">Price: Low to High</option>
                      <option style={selectOptionStyle} value="priceHigh">Price: High to Low</option>
                      <option style={selectOptionStyle} value="name">Name</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>
                </div>
              </div>

              <p className="text-[#6E6A66] font-['Inter'] mb-8">
                {sortedShoes.length} {sortedShoes.length === 1 ? 'shoe' : 'shoes'} found
              </p>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-[2px] gap-y-10">
                {sortedShoes.map((shoe, index) => (
                  <ProductCard key={shoe.id} product={shoe} index={index} />
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
