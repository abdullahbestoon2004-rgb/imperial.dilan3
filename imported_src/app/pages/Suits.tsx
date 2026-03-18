import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';

export default function Suits() {
  const [sortBy, setSortBy] = useState('featured');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const allSuits = [
    {
      id: 1,
      name: 'Classic Black Suit',
      price: 420,
      color: 'black',
      image: 'https://images.unsplash.com/photo-1763394857933-56b8a670996f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN1aXQlMjBmb3JtYWwlMjBtZW5zd2VhcnxlbnwxfHx8fDE3NzMxNDMyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1768696082783-4313d98341ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zd2VhciUyMGNoYXJjb2FsJTIwc3VpdHxlbnwxfHx8fDE3NzMxNDMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'Navy Blue Suit',
      price: 450,
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1769876363241-d8efe9bdfd2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYmx1ZSUyMHN1aXQlMjBmb3JtYWx8ZW58MXx8fHwxNzczMTQzNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1697811599461-38124b3decc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdWl0JTIwZ3JheSUyMGNvbnRlbXBvcmFyeXxlbnwxfHx8fDE3NzMxNDMyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Beige Linen Suit',
      price: 390,
      color: 'beige',
      image: 'https://images.unsplash.com/photo-1766113494461-0e5b2a96c66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwdGFpbG9yZWQlMjBzdWl0JTIwYmVpZ2V8ZW58MXx8fHwxNzczMTQzMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1761522002071-67755dc6c820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWFuJTIwc3VpdCUyMGx1eHVyeSUyMGZhc2hpb258ZW58MXx8fHwxNzczMTQzMjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      name: 'Charcoal Gray Suit',
      price: 480,
      color: 'gray',
      image: 'https://images.unsplash.com/photo-1768696082783-4313d98341ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zd2VhciUyMGNoYXJjb2FsJTIwc3VpdHxlbnwxfHx8fDE3NzMxNDMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1763394857933-56b8a670996f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN1aXQlMjBmb3JtYWwlMjBtZW5zd2VhcnxlbnwxfHx8fDE3NzMxNDMyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      name: 'Tan Brown Suit',
      price: 410,
      color: 'brown',
      image: 'https://images.unsplash.com/photo-1712773663204-9dce38ddae57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW4lMjBicm93biUyMHN1aXQlMjBtb2Rlcm58ZW58MXx8fHwxNzczMTQzNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1750586403232-ddc60c0e34aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXZ5JTIwYmxhemVyJTIwamFja2V0JTIwbWVufGVufDF8fHx8MTc3MzE0MzI0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      name: 'Pinstripe Suit',
      price: 520,
      color: 'black',
      image: 'https://images.unsplash.com/photo-1769107263443-ef16af85070a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5zdHJpcGUlMjBzdWl0JTIwY2xhc3NpY3xlbnwxfHx8fDE3NzMxNDM1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1768696082783-4313d98341ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zd2VhciUyMGNoYXJjb2FsJTIwc3VpdHxlbnwxfHx8fDE3NzMxNDMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 7,
      name: 'Light Gray Suit',
      price: 430,
      color: 'gray',
      image: 'https://images.unsplash.com/photo-1636452147512-91a6cbcdb681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMGdyYXklMjBzdWl0JTIwY29udGVtcG9yYXJ5fGVufDF8fHx8MTc3MzE0MzUwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1697811599461-38124b3decc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdWl0JTIwZ3JheSUyMGNvbnRlbXBvcmFyeXxlbnwxfHx8fDE3NzMxNDMyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 8,
      name: 'Burgundy Suit',
      price: 490,
      color: 'red',
      image: 'https://images.unsplash.com/photo-1770235623084-7fde436a781d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJndW5keSUyMHN1aXQlMjBsdXh1cnl8ZW58MXx8fHwxNzczMTQzNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1763394857933-56b8a670996f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN1aXQlMjBmb3JtYWwlMjBtZW5zd2VhcnxlbnwxfHx8fDE3NzMxNDMyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 9,
      name: 'Olive Green Suit',
      price: 460,
      color: 'green',
      image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMGdyZWVuJTIwc3VpdCUyMGVsZWdhbnR8ZW58MXx8fHwxNzczMTQzNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1768696082783-4313d98341ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zd2VhciUyMGNoYXJjb2FsJTIwc3VpdHxlbnwxfHx8fDE3NzMxNDMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 10,
      name: 'Cream Summer Suit',
      price: 380,
      color: 'beige',
      image: 'https://images.unsplash.com/photo-1769162338038-3ca0f16d2d6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhbSUyMHN1aXQlMjBzdW1tZXJ8ZW58MXx8fHwxNzczMTQzNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1766113494461-0e5b2a96c66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwdGFpbG9yZWQlMjBzdWl0JTIwYmVpZ2V8ZW58MXx8fHwxNzczMTQzMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 11,
      name: 'Double-Breasted Navy',
      price: 550,
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1769876363241-d8efe9bdfd2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYmx1ZSUyMHN1aXQlMjBmb3JtYWx8ZW58MXx8fHwxNzczMTQzNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1750586403232-ddc60c0e34aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXZ5JTIwYmxhemVyJTIwamFja2V0JTIwbWVufGVufDF8fHx8MTc3MzE0MzI0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 12,
      name: 'Midnight Black Tuxedo',
      price: 620,
      color: 'black',
      image: 'https://images.unsplash.com/photo-1763394857933-56b8a670996f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN1aXQlMjBmb3JtYWwlMjBtZW5zd2VhcnxlbnwxfHx8fDE3NzMxNDMyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1769107263443-ef16af85070a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5zdHJpcGUlMjBzdWl0JTIwY2xhc3NpY3xlbnwxfHx8fDE3NzMxNDM1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  // Filter suits based on selections
  let filteredSuits = allSuits;

  if (selectedColor !== 'all') {
    filteredSuits = filteredSuits.filter(suit => suit.color === selectedColor);
  }

  if (selectedPrice !== 'all') {
    if (selectedPrice === 'under400') {
      filteredSuits = filteredSuits.filter(suit => suit.price < 400);
    } else if (selectedPrice === '400to500') {
      filteredSuits = filteredSuits.filter(suit => suit.price >= 400 && suit.price <= 500);
    } else if (selectedPrice === 'over500') {
      filteredSuits = filteredSuits.filter(suit => suit.price > 500);
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
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-[#0B0B0B] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-['Playfair_Display'] text-white mb-4"
          >
            Premium Suits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/80 font-['Inter']"
          >
            Crafted to perfection for the modern gentleman
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="container mx-auto px-6">
          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Color Filter */}
              <div className="relative">
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="appearance-none bg-white border border-[#E5E5E5] px-6 py-3 pr-10 font-['Inter'] text-[#0B0B0B] cursor-pointer hover:border-[#C6A96B] transition-colors focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="all">All Colors</option>
                  <option value="black">Black</option>
                  <option value="blue">Blue</option>
                  <option value="gray">Gray</option>
                  <option value="beige">Beige</option>
                  <option value="brown">Brown</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
              </div>

              {/* Price Filter */}
              <div className="relative">
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="appearance-none bg-white border border-[#E5E5E5] px-6 py-3 pr-10 font-['Inter'] text-[#0B0B0B] cursor-pointer hover:border-[#C6A96B] transition-colors focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="all">All Prices</option>
                  <option value="under400">Under $400</option>
                  <option value="400to500">$400 - $500</option>
                  <option value="over500">Over $500</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-[#666] font-['Inter'] text-sm">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#E5E5E5] px-6 py-3 pr-10 font-['Inter'] text-[#0B0B0B] cursor-pointer hover:border-[#C6A96B] transition-colors focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-[#666] font-['Inter'] mb-8">
            {sortedSuits.length} {sortedSuits.length === 1 ? 'suit' : 'suits'} found
          </p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedSuits.map((suit, index) => (
              <ProductCard key={suit.id} product={suit} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
