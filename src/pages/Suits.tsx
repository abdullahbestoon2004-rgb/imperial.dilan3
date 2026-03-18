import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';
import { CategorySidebar } from '../components/CategorySidebar';
import { ParallaxBanner } from '../components/animations';

export default function Suits() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const selectClassName = "appearance-none bg-[#7A4A2A] border border-[#6E6A66] px-6 py-3 pr-10 font-['Inter'] text-[#E7D7C4] cursor-pointer hover:border-[#D6A25B] transition-colors focus:outline-none focus:border-[#D6A25B]";
  const selectOptionStyle = { backgroundColor: '#1B1411', color: '#E7D7C4' };
  const categoryOptions = [
    { value: 'all', label: 'All Clothing' },
    { value: 'suits', label: 'Suits' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'coats', label: 'Coats' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'waistcoats', label: 'Waistcoats' },
    { value: 'knitwear', label: 'Knitwear' },
    { value: 'casual', label: 'Casual' },
  ];

  const allSuits = [
    {
      id: 1,
      name: 'Classic Black Suit',
      price: 420,
      color: 'black',
      category: 'classic',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199699_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199699_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 2,
      name: 'Navy Blue Suit',
      price: 450,
      color: 'blue',
      category: 'classic',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI715A12700001_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI715A12700001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 3,
      name: 'Kent Handmade Wool Gabardine Suit',
      price: 390,
      color: 'beige',
      category: 'tailored',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798971254003_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798971254003_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 4,
      name: 'Gregory Hand-Tailored Birdseye Suit',
      price: 480,
      color: 'gray',
      category: 'tailored',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798977343001_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798977343001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 5,
      name: 'Kent Hand-Tailored Plaid Cashmere Suit',
      price: 410,
      color: 'brown',
      category: 'patterned',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798963805001_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798963805001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 6,
      name: 'Kent Hand-Tailored Glen Plaid Suit',
      price: 520,
      color: 'black',
      category: 'patterned',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798945028001_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798945028001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 7,
      name: 'Light Gray Suit',
      price: 430,
      color: 'gray',
      category: 'classic',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798977343001_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798977343001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 8,
      name: 'Gregory Hand-Tailored Wool Peak Tuxedo',
      price: 490,
      color: 'red',
      category: 'tuxedo',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339428_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339428_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 9,
      name: 'Kent Hand-Tailored Glen Plaid Suit',
      price: 460,
      color: 'green',
      category: 'patterned',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798P06907001_alternate10?$rl_4x5_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798P06907001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 10,
      name: 'Gregory Hand-Tailored Wool Serge Blazer',
      price: 380,
      color: 'beige',
      category: 'blazer',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339457_alternate10?$rl_4x5_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1339457_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 11,
      name: 'Gregory Handmade Tailcoat Tuxedo',
      price: 550,
      color: 'blue',
      category: 'tuxedo',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1375839_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1375839_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 12,
      name: 'Kent Hand-Tailored Wool Flannel Jacket',
      price: 620,
      color: 'black',
      category: 'jacket',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798P06876001_alternate10?$rl_4x5_zoom$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI798P06876001_lifestyle?$rl_4x5_zoom$'
    }
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


  const normalizeSuitCategory = (category: string) => {
    if (['classic', 'tailored', 'patterned', 'tuxedo'].includes(category)) return 'suits';
    if (['blazer', 'jacket'].includes(category)) return 'jackets';
    return category;
  };

  // Filter suits based on selections
  let filteredSuits = allSuits;

  if (selectedCategory !== 'all') {
    filteredSuits = filteredSuits.filter((suit) => normalizeSuitCategory(suit.category) === selectedCategory);
  }

  if (selectedColor !== 'all') {
    filteredSuits = filteredSuits.filter((suit) => suit.color === selectedColor);
  }

  if (selectedPrice !== 'all') {
    if (selectedPrice === 'under400') {
      filteredSuits = filteredSuits.filter((suit) => suit.price < 400);
    } else if (selectedPrice === '400to500') {
      filteredSuits = filteredSuits.filter((suit) => suit.price >= 400 && suit.price <= 500);
    } else if (selectedPrice === 'over500') {
      filteredSuits = filteredSuits.filter((suit) => suit.price > 500);
    }
  }

  // Sort suits
  const sortedSuits = [...filteredSuits].sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // featured (default order)
  });

  return (
    <>
      <ParallaxBanner
        imageSrc="/dilanWalking.png"
        imageAlt="Dilan walking"
        eager
        imageClassName="object-cover object-top"
      >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-['Playfair_Display'] text-[#F6F3EE] mb-4"
          >
            Premium Suits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#F6F3EE]/80 font-['Inter']"
          >
            Crafted to perfection for the modern gentleman
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
              {/* Filters and Sort */}
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  {/* Color Filter */}
                  <div className="relative">
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className={selectClassName}
                    >
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

                  {/* Price Filter */}
                  <div className="relative">
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className={selectClassName}
                    >
                      <option style={selectOptionStyle} value="all">All Prices</option>
                      <option style={selectOptionStyle} value="under400">Under $400</option>
                      <option style={selectOptionStyle} value="400to500">$400 - $500</option>
                      <option style={selectOptionStyle} value="over500">Over $500</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A66] font-['Inter'] text-sm">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={selectClassName}
                    >
                      <option style={selectOptionStyle} value="featured">Featured</option>
                      <option style={selectOptionStyle} value="priceLow">Price: Low to High</option>
                      <option style={selectOptionStyle} value="priceHigh">Price: High to Low</option>
                      <option style={selectOptionStyle} value="name">Name</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <p className="text-[#6E6A66] font-['Inter'] mb-8">
                {sortedSuits.length} {sortedSuits.length === 1 ? 'suit' : 'suits'} found
              </p>

              {/* Products Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-[2px] gap-y-10">
                {sortedSuits.map((suit, index) => (
                  <ProductCard key={suit.id} product={suit} index={index} />
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
