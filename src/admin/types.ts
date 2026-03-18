export type AdminSectionId =
  | 'dashboard'
  | 'pageHome'
  | 'pageNewArrivals'
  | 'pageSuits'
  | 'pageShoes'
  | 'pageAccessories'
  | 'products'
  | 'categories'
  | 'collections'
  | 'orders'
  | 'customers'
  | 'messages'
  | 'content'
  | 'media'
  | 'discounts'
  | 'settings';

export type ProductStatus = 'Published' | 'Draft';
export type Availability = 'In Stock' | 'Out of Stock';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';
export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';
export type DiscountType = 'percentage' | 'fixed';
export type MediaType = 'product' | 'banner' | 'graphic';
export type ProductSubcategory = 'Formal' | 'Casual' | 'Seasonal';

export interface ProductVariant {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
  priceOverride: number | null;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  subcategory?: ProductSubcategory;
  productType: 'Clothing' | 'Accessory';
  price: number;
  discountPrice: number | null;
  currency: string;
  stockQuantity: number;
  sku: string;
  availability: Availability;
  sizes: string[];
  colors: string[];
  variants?: ProductVariant[];
  images: string[];
  mainImageIndex: number;
  tags: string[];
  status: ProductStatus;
  showOnHomepage: boolean;
  featured: boolean;
  visible: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export type ProductDraft = Omit<Product, 'id' | 'updatedAt'>;

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  displayOrder: number;
  productCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  featured: boolean;
  season: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: string;
  timeline: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
  segment: 'VIP' | 'Returning' | 'New';
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface WebsiteContent {
  heroTitle: string;
  heroSubtitle: string;
  homepageBannerTitle: string;
  homepageBannerText: string;
  aboutTitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  footerLinks: string[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  uploadedAt: string;
}

export interface Discount {
  id: string;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  expiresAt: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  logoUrl: string;
  currency: string;
  contactEmail: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: 'info' | 'alert' | 'success';
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TrafficSource {
  source: string;
  value: number;
}

export interface AdminDataShape {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  orders: Order[];
  customers: Customer[];
  messages: Message[];
  websiteContent: WebsiteContent;
  mediaLibrary: MediaItem[];
  discounts: Discount[];
  settings: StoreSettings;
  notifications: AdminNotification[];
  revenueSeries: RevenuePoint[];
  trafficSources: TrafficSource[];
}
