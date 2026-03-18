import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';
import { CategorySidebar } from '../components/CategorySidebar';
import { ParallaxBanner } from '../components/animations';

export default function Accessories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const selectClassName = "appearance-none bg-[#7A4A2A] border border-[#6E6A66] px-6 py-3 pr-10 font-['Inter'] text-[#E7D7C4] cursor-pointer hover:border-[#D6A25B] transition-colors focus:outline-none focus:border-[#D6A25B]";
  const selectOptionStyle = { backgroundColor: '#1B1411', color: '#E7D7C4' };
  const accessoryCategoryLabels: Record<string, string> = {
    belts: 'Belts',
    watches: 'Watches',
    sunglasses: 'Sunglasses',
    bags: 'Bags',
    wallets: 'Wallets',
    ties: 'Ties',
  };

  const allAccessories = [
    {
      id: 201,
      name: 'Sterling Dress Belt',
      price: 128,
      color: 'black',
      category: 'belts',
      brand: 'Polo Ralph Lauren',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0976/D11Y/FR/04F72497-3441-4D96-8387-CBC9F8907E1C_FAR0976_D11Y_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0976/D11Y/L1/4964176B-D171-4693-9049-C5185460C297_FAR0976_D11Y_MEDIUM.jpg',
    },
    {
      id: 202,
      name: 'Heritage Leather Belt',
      price: 136,
      color: 'brown',
      category: 'belts',
      brand: 'Purple Label',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0543/W000/FR/4D4466D4-FC6C-4C40-869F-003D1A6B0490_FAR0543_W000_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0543/W000/L1/8842A717-2A4F-4CF3-9010-37D2193DBC8E_FAR0543_W000_MEDIUM.jpg',
    },
    {
      id: 203,
      name: 'Yale Tie',
      price: 425,
      color: 'black',
      category: 'watches',
      brand: 'Imperial',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0543/8000/FR/E8F1DFA3-FB9A-4501-8A53-EE3E6B653F4F_FAR0543_8000_MEDIUM.jpg',
      imageHover:'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0543/8000/L1/A07FD45B-4DBF-497D-9190-C234266C531D_FAR0543_8000_MEDIUM.jpg',
    },
    {
      id: 204,
      name: 'Regent Steel Watch',
      price: 510,
      color: 'gray',
      category: 'watches',
      brand: 'Imperial',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0511/H02W/FR/75581676-1472-4767-80DE-E4003D946195_FAR0511_H02W_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAR/FAR0511/H02W/L1/BA4CDBF1-0AF8-47FB-BAD3-07375664A84F_FAR0511_H02W_MEDIUM.jpg',
    },
    {
      id: 205,
      name: 'Aviator Sunglasses',
      price: 198,
      color: 'gray',
      category: 'sunglasses',
      brand: 'Polo Ralph Lauren',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ9151/W000/FR/FD8A0549-B39D-49A4-AEFA-1A977AE28B09_FAQ9151_W000_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ9151/W000/L1/49990211-0D1A-4A33-9B5A-9CB9CCF0F126_FAQ9151_W000_MEDIUM.jpg',
    },
    {
      id: 206,
      name: 'Round Acetate Sunglasses',
      price: 176,
      color: 'blue',
      category: 'sunglasses',
      brand: 'Polo Ralph Lauren',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ9151/M11S/FR/721D7849-E566-40A9-A003-67D6586EC886_FAQ9151_M11S_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ9151/M11S/L1/C25EFD6A-B517-4B76-9141-5FF3A949A651_FAQ9151_M11S_MEDIUM.jpg',
    },
    {
      id: 207,
      name: 'West End Leather Duffle',
      price: 580,
      color: 'brown',
      category: 'bags',
      brand: 'Purple Label',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP1950/W000/FR/4C270F81-B4BB-487C-90D2-0BFDF416D967_FAP1950_W000_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/HYBRIS/FAP/FAP1950/517851C9-7CE0-4557-888C-7351222C34E0/FAP1950_W000_MEDIUM.jpg',
    },
    {
      id: 208,
      name: 'Madison Weekender Bag',
      price: 620,
      color: 'black',
      category: 'bags',
      brand: 'Purple Label',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP1950/E028/FR/6DF0175A-633A-4A5D-BBBD-65F87C68DD9F_FAP1950_E028_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/HYBRIS/FAP/FAP1950/D5DA47F0-B6D6-429F-8645-6D9582E5396E/FAP1950_E028_MEDIUM.jpg',
    },
    {
      id: 209,
      name: 'Slim Calfskin Wallet',
      price: 142,
      color: 'black',
      category: 'wallets',
      brand: 'Polo Ralph Lauren',
      image: 'https://media.loropiana.com/HYBRIS/FAP/FAP1950/EDB2E9B9-1F76-4BD1-A711-FF75F55C8733/FAP1950_8000_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/HYBRIS/FAP/FAP1950/9F1052BC-993D-4F62-8821-E432CA5A2648/FAP1950_8000_MEDIUM.jpg',
    },
    {
      id: 210,
      name: 'Bifold Signature Wallet',
      price: 158,
      color: 'beige',
      category: 'wallets',
      brand: 'Polo Ralph Lauren',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/W000/FR/9F6F6C96-C464-4A79-80A2-55EA800A4B2E_FAO3774_W000_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/W000/L1/1A11FE05-5B83-4608-B099-105913059998_FAO3774_W000_MEDIUM.jpg',
    },
    {
      id: 211,
      name: 'Silk Grenadine Tie',
      price: 98,
      color: 'red',
      category: 'ties',
      brand: 'Purple Label',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/E008/FR/B1352520-0DEB-4E44-895D-5E7BBCC91157_FAO3774_E008_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/E008/L1/D5FD3E0A-F186-491E-84C9-520193BE1242_FAO3774_E008_MEDIUM.jpg',
    },
    {
      id: 212,
      name: 'Classic Silk Tie',
      price: 112,
      color: 'blue',
      category: 'ties',
      brand: 'Purple Label',
      image: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/FR/CDADC9E6-ABD1-4138-9949-27CB0D7B5618_FAO3774_M006_MEDIUM.jpg',
      imageHover: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/L1/AFF88145-E7A8-4A8A-B621-93CC301C5598_FAO3774_M006_MEDIUM.jpg',
    },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Accessories' },
    ...Array.from(new Set(allAccessories.map((item) => item.category))).map((category) => ({
      value: category,
      label: accessoryCategoryLabels[category] ?? category,
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

  let filteredAccessories = allAccessories;

  if (selectedCategory !== 'all') {
    filteredAccessories = filteredAccessories.filter((item) => item.category === selectedCategory);
  }

  if (selectedColor !== 'all') {
    filteredAccessories = filteredAccessories.filter((item) => item.color === selectedColor);
  }

  if (selectedPrice !== 'all') {
    if (selectedPrice === 'under150') {
      filteredAccessories = filteredAccessories.filter((item) => item.price < 150);
    } else if (selectedPrice === '150to300') {
      filteredAccessories = filteredAccessories.filter((item) => item.price >= 150 && item.price <= 300);
    } else if (selectedPrice === 'over300') {
      filteredAccessories = filteredAccessories.filter((item) => item.price > 300);
    }
  }

  const sortedAccessories = [...filteredAccessories].sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <ParallaxBanner
        imageSrc="https://images.unsplash.com/photo-1715446929992-3f3d2b7a9467?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Premium accessories"
        eager
        overlayClassName="bg-gradient-to-b from-[#2F2F2F]/55 to-[#2F2F2F]/75"
      >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-['Playfair_Display'] text-[#F6F3EE] mb-4"
          >
            Premium Accessories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#F6F3EE]/80 font-['Inter']"
          >
            Finishing pieces that define your signature style.
          </motion.p>
      </ParallaxBanner>

      <section className="py-16 bg-[#E8E1D8]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:w-72 lg:shrink-0">
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
                    <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)} className={selectClassName}>
                      <option style={selectOptionStyle} value="all">All Colors</option>
                      <option style={selectOptionStyle} value="black">Black</option>
                      <option style={selectOptionStyle} value="blue">Blue</option>
                      <option style={selectOptionStyle} value="gray">Gray</option>
                      <option style={selectOptionStyle} value="beige">Beige</option>
                      <option style={selectOptionStyle} value="brown">Brown</option>
                      <option style={selectOptionStyle} value="red">Red</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select value={selectedPrice} onChange={(event) => setSelectedPrice(event.target.value)} className={selectClassName}>
                      <option style={selectOptionStyle} value="all">All Prices</option>
                      <option style={selectOptionStyle} value="under150">Under $150</option>
                      <option style={selectOptionStyle} value="150to300">$150 - $300</option>
                      <option style={selectOptionStyle} value="over300">Over $300</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D6A25B] pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A66] font-['Inter'] text-sm">Sort by:</span>
                  <div className="relative">
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClassName}>
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
                {sortedAccessories.length} {sortedAccessories.length === 1 ? 'item' : 'items'} found
              </p>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-[2px] gap-y-10">
                {sortedAccessories.map((item, index) => (
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
