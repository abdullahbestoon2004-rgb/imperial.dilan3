export type SortOption =
  | 'recommended'
  | 'new-arrivals'
  | 'best-sellers'
  | 'price-low-high'
  | 'price-high-low';

export type PriceRange = 'under-200' | '200-300' | '300-400' | '400-plus';

export interface ShoeProduct {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  style: string;
  featuredRank: number;
  bestSellerScore: number;
  newArrivalRank: number;
}

export interface ShoeFilters {
  sizes: string[];
  colors: string[];
  brands: string[];
  prices: PriceRange[];
  styles: string[];
}