import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Lookbook } from '../components/Lookbook';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Testimonials } from '../components/Testimonials';
import { Newsletter } from '../components/Newsletter';

export default function Home() {
  // Category images
  const categories = [
    {
      name: 'Suits',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199698_alternate10?$rl_4x5_pdp$'
    },
    {
      name: 'Jackets',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI710968117004_alternate10?$rl_4x5_pdp$'
    },
    {
      name: 'Shirts',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1266689_lifestyle?$rl_4x5_zoom$'
    },
    {
      name: 'Shoes',
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1183688_lifestyle?$rl_1x1_pdp$'
    }
  ];

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Classic Black Suit',
      price: 420,
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI715A12700001_alternate10?$rl_4x5_pdp$$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI715A12700001_lifestyle?$rl_4x5_zoom$'
    },
    {
      id: 2,
      name: 'Navy Blue Suit',
      price: 450,
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199698_alternate10?$rl_4x5_pdp$',
      imageHover: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199698_alternate10?$rl_4x5_pdp$'
    },
    {
      id: 3,
      name: 'Beige Linen Suit',
      price: 390,
      image: 'https://images.unsplash.com/photo-1766113494461-0e5b2a96c66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwdGFpbG9yZWQlMjBzdWl0JTIwYmVpZ2V8ZW58MXx8fHwxNzczMTQzMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1761522002071-67755dc6c820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWFuJTIwc3VpdCUyMGx1eHVyeSUyMGZhc2hpb258ZW58MXx8fHwxNzczMTQzMjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      name: 'Charcoal Suit',
      price: 480,
      image: 'https://images.unsplash.com/photo-1768696082783-4313d98341ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zd2VhciUyMGNoYXJjb2FsJTIwc3VpdHxlbnwxfHx8fDE3NzMxNDMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      imageHover: 'https://images.unsplash.com/photo-1763394857933-56b8a670996f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN1aXQlMjBmb3JtYWwlMjBtZW5zd2VhcnxlbnwxfHx8fDE3NzMxNDMyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  // Lookbook images
  const lookbookImages = [
    {
      image: 'https://images.unsplash.com/photo-1582274528667-1e8a10ded835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW50bGVtYW4lMjB3YWxraW5nJTIwY2l0eSUyMHN1aXR8ZW58MXx8fHwxNzczMTQzMjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Urban Sophistication'
    },
    {
      image: 'https://images.unsplash.com/photo-1745270008562-318fb7dbfe1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBkaW5uZXIlMjB0dXhlZG8lMjBlbGVnYW50fGVufDF8fHx8MTc3MzE0MzI0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Formal Excellence'
    },
    {
      image: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1199698_alternate10?$rl_4x5_pdp$',
      title: 'Business Casual'
    }
  ];

  return (
    <>
      <Hero heroImage="/dilan.png" />
      <Categories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <Lookbook images={lookbookImages} />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
