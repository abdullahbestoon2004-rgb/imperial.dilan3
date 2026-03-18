import {
  Archive,
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Mail,
  BadgePercent,
  MenuSquare,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Settings2,
  Star,
  Trash2,
  UserRound,
} from 'lucide-react';
import { motion } from 'motion/react';
import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import { AdminShell, type NavItem } from '../components/AdminShell';
import {
  Badge,
  Button,
  Field,
  Modal,
  Panel,
  SectionHeader,
  Select,
  StatCard,
  TextArea,
  TextInput,
} from '../components/AdminPrimitives';
import { ProductEditorForm } from '../components/ProductEditorForm';
import { useAdminData } from '../hooks/useAdminData';
import type {
  AdminSectionId,
  Category,
  Collection,
  Discount,
  MediaItem,
  Message,
  Order,
  Product,
  StoreSettings,
  WebsiteContent,
} from '../types';

const sections: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pageHome', label: 'Home Page' },
  { id: 'pageNewArrivals', label: 'New Arrivals Page' },
  { id: 'pageSuits', label: 'Suits Page' },
  { id: 'pageShoes', label: 'Shoes Page' },
  { id: 'pageAccessories', label: 'Accessories Page' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'collections', label: 'Collections' },
  { id: 'orders', label: 'Orders' },
  { id: 'customers', label: 'Customers' },
  { id: 'messages', label: 'Messages' },
  { id: 'content', label: 'Website Content' },
  { id: 'media', label: 'Media Library' },
  { id: 'discounts', label: 'Discounts' },
  { id: 'settings', label: 'Settings' },
];

const productCategories = ['Suits', 'Jackets', 'Shirts', 'Pants', 'Shoes', 'Accessories'];
const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const tagOptions = ['New', 'Best Seller', 'Featured', 'Sale'];
const storefrontPageSections = ['pageHome', 'pageNewArrivals', 'pageSuits', 'pageShoes', 'pageAccessories'] as const;

type SortDirection = 'asc' | 'desc';
type ProductDraft = Omit<Product, 'id' | 'updatedAt'>;
type StorefrontPageSectionId = (typeof storefrontPageSections)[number];
type StorefrontPageConfig = {
  title: string;
  description: string;
  addLabel: string;
  emptyState: string;
  matchesProduct: (product: Product) => boolean;
  createDefaults: Partial<ProductDraft>;
  removeLabel?: string;
};

const defaultProductForm: ProductDraft = {
  name: '',
  brand: '',
  description: '',
  category: 'Suits',
  productType: 'Clothing',
  price: 0,
  discountPrice: null,
  currency: 'USD',
  stockQuantity: 0,
  sku: '',
  availability: 'In Stock',
  sizes: ['M'],
  colors: ['Midnight Navy'],
  images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80'],
  mainImageIndex: 0,
  tags: ['New'],
  status: 'Draft',
  showOnHomepage: false,
  featured: false,
  visible: true,
};

const storefrontPageConfigs: Record<StorefrontPageSectionId, StorefrontPageConfig> = {
  pageHome: {
    title: 'Home Page',
    description: 'Control homepage copy and the products featured on the front page.',
    addLabel: 'Add Homepage Item',
    emptyState: 'No products are assigned to the homepage yet.',
    matchesProduct: (product) => product.showOnHomepage,
    createDefaults: {
      showOnHomepage: true,
      featured: true,
      status: 'Published',
      visible: true,
    },
    removeLabel: 'Remove from Home',
  },
  pageNewArrivals: {
    title: 'New Arrivals Page',
    description: 'Manage the newest products highlighted in the New Arrivals experience.',
    addLabel: 'Add New Arrival',
    emptyState: 'No products are marked for New Arrivals yet.',
    matchesProduct: (product) => product.tags.includes('New'),
    createDefaults: {
      tags: ['New'],
      status: 'Published',
      visible: true,
    },
    removeLabel: 'Remove from New',
  },
  pageSuits: {
    title: 'Suits Page',
    description: 'Add, edit, or remove the products shown on the suits page.',
    addLabel: 'Add Suit Item',
    emptyState: 'No suit products are available on this page yet.',
    matchesProduct: (product) => product.category === 'Suits',
    createDefaults: {
      category: 'Suits',
      productType: 'Clothing',
      status: 'Published',
      visible: true,
    },
  },
  pageShoes: {
    title: 'Shoes Page',
    description: 'Manage the products listed on the shoes page and keep the assortment fresh.',
    addLabel: 'Add Shoe Item',
    emptyState: 'No shoe products are available on this page yet.',
    matchesProduct: (product) => product.category === 'Shoes',
    createDefaults: {
      category: 'Shoes',
      productType: 'Clothing',
      status: 'Published',
      visible: true,
    },
  },
  pageAccessories: {
    title: 'Accessories Page',
    description: 'Curate accessories, add new products, and remove old pieces from the page.',
    addLabel: 'Add Accessory Item',
    emptyState: 'No accessory products are available on this page yet.',
    matchesProduct: (product) => product.category === 'Accessories',
    createDefaults: {
      category: 'Accessories',
      productType: 'Accessory',
      status: 'Published',
      visible: true,
    },
  },
};

function isStorefrontPageSection(id: AdminSectionId): id is StorefrontPageSectionId {
  return storefrontPageSections.includes(id as StorefrontPageSectionId);
}

function toProductPayload(product: Product): ProductDraft {
  const { id, updatedAt, ...payload } = product;
  return payload;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error(`Could not read ${file.name}`));
    };
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function formatMoney(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function DataTable({
  columns,
  children,
}: {
  columns: { key: string; label: string; sortable?: boolean; onSort?: () => void; active?: boolean }[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-xs uppercase tracking-[0.24em] text-[#E8E1D8]/55">
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={column.onSort}
                      className={`inline-flex items-center gap-2 ${column.active ? 'text-[#F6F3EE]' : ''}`}
                    >
                      {column.label}
                      <ArrowDownUp className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-white/6 last:border-b-0">{children}</tr>;
}

function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-top text-sm text-[#E8E1D8] ${className}`}>{children}</td>;
}

function MiniAreaChart({ points }: { points: { label: string; revenue: number }[] }) {
  const max = Math.max(...points.map((point) => point.revenue), 1);
  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 100 - point.revenue / max * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <Panel className="overflow-hidden">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#E8E1D8]/60">Revenue performance</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#F6F3EE]">Sales trend</h3>
        </div>
        <Badge tone="gold">Live mock data</Badge>
      </div>

      <div className="relative h-56">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2D332B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2D332B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#revenueGradient)" />
          <path d={path} fill="none" stroke="#2D332B" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between text-xs text-[#E8E1D8]/45">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function BarsChart({ points }: { points: { label: string; orders: number }[] }) {
  const max = Math.max(...points.map((point) => point.orders), 1);

  return (
    <Panel>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#E8E1D8]/60">Order velocity</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#F6F3EE]">Monthly orders</h3>
        </div>
        <Badge tone="blue">6 months</Badge>
      </div>
      <div className="flex h-56 items-end gap-3">
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-[18px] bg-[linear-gradient(180deg,#2D332B_0%,#B68B63_100%)]"
                style={{ height: `${(point.orders / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#E8E1D8]/55">{point.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProductForm({
  initial,
  defaults,
  onSubmit,
}: {
  initial?: Product;
  defaults?: Partial<ProductDraft>;
  onSubmit: (payload: ProductDraft) => void;
}) {
  const [form, setForm] = useState<ProductDraft>(() => {
    if (initial) {
      return toProductPayload(initial);
    }

    return {
      ...defaultProductForm,
      ...defaults,
      sizes: defaults?.sizes ? [...defaults.sizes] : [...defaultProductForm.sizes],
      colors: defaults?.colors ? [...defaults.colors] : [...defaultProductForm.colors],
      images: defaults?.images ? [...defaults.images] : [...defaultProductForm.images],
      tags: defaults?.tags ? [...defaults.tags] : [...defaultProductForm.tags],
    };
  });
  const [imageDraft, setImageDraft] = useState('');

  const toggleArrayValue = (key: 'sizes' | 'tags', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= form.images.length) return;

    setForm((prev) => {
      const images = [...prev.images];
      [images[index], images[target]] = [images[target], images[index]];
      let mainImageIndex = prev.mainImageIndex;
      if (mainImageIndex === index) mainImageIndex = target;
      else if (mainImageIndex === target) mainImageIndex = index;
      return { ...prev, images, mainImageIndex };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    try {
      const uploadedImages = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
    } finally {
      event.target.value = '';
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Product Name">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Brand">
          <TextInput value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Product Type">
          <Select
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value as Product['productType'] })}
          >
            <option value="Clothing">Clothing</option>
            <option value="Accessory">Accessory</option>
          </Select>
        </Field>
        <Field label="Price">
          <TextInput type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        </Field>
        <Field label="Discount Price">
          <TextInput
            type="number"
            min="0"
            value={form.discountPrice ?? ''}
            onChange={(e) => setForm({ ...form, discountPrice: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Field>
        <Field label="Currency">
          <TextInput value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
        </Field>
        <Field label="Stock Quantity">
          <TextInput
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
          />
        </Field>
        <Field label="SKU">
          <TextInput value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        </Field>
        <Field label="Availability">
          <Select
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value as Product['availability'] })}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </Select>
        </Field>
        <Field label="Visibility">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product['status'] })}>
            <option value="Published">Publish</option>
            <option value="Draft">Draft</option>
          </Select>
        </Field>
        <Field label="Main Image">
          <Select
            value={String(form.mainImageIndex)}
            onChange={(e) => setForm({ ...form, mainImageIndex: Number(e.target.value) })}
          >
            {form.images.map((_, index) => (
              <option key={index} value={index}>
                Image {index + 1}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Description">
        <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#F6F3EE]">Variants</h3>
            <p className="text-sm text-[#E8E1D8]/60">Sizes and color options ready for real inventory logic later.</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#E8E1D8]/55">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleArrayValue('sizes', size)}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      form.sizes.includes(size)
                        ? 'bg-[#2D332B] text-[#F6F3EE]'
                        : 'border border-white/10 bg-white/[0.03] text-[#E8E1D8]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Colors">
              <TextInput
                value={form.colors.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    colors: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                  })
                }
                placeholder="Midnight Navy, Obsidian, Champagne"
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#F6F3EE]">Images</h3>
              <p className="text-sm text-[#E8E1D8]/60">Upload multiple images or paste image URLs, then choose the main image and order.</p>
            </div>
            <Badge tone="blue">Storage-ready</Badge>
          </div>

          <div className="mb-4 space-y-3">
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#F6F3EE] transition hover:border-[#2D332B]/40 hover:text-[#2D332B]">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              <ImagePlus className="h-4 w-4" />
              Upload Multiple Images
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <TextInput value={imageDraft} onChange={(e) => setImageDraft(e.target.value)} placeholder="Paste image URL" />
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!imageDraft.trim()) return;
                  setForm((prev) => ({ ...prev, images: [...prev.images, imageDraft.trim()] }));
                  setImageDraft('');
                }}
              >
                <ImagePlus className="h-4 w-4" />
                Add Image URL
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {form.images.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <img src={image} alt="Product preview" className="h-36 w-full object-cover" />
                <div className="space-y-3 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-[0.22em] text-[#E8E1D8]/50">
                      {index === form.mainImageIndex ? 'Main image' : `Image ${index + 1}`}
                    </span>
                    <GripVertical className="h-4 w-4 text-[#E8E1D8]/35" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => moveImage(index, -1)}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => moveImage(index, 1)}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setForm((prev) => ({ ...prev, mainImageIndex: index }))}
                    >
                      Main
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="flex-1"
                      onClick={() =>
                        setForm((prev) => {
                          const images = prev.images.filter((_, itemIndex) => itemIndex !== index);
                          const mainImageIndex = images.length === 0 ? 0 : Math.min(prev.mainImageIndex, images.length - 1);
                          return { ...prev, images, mainImageIndex };
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <h3 className="mb-4 text-lg font-semibold text-[#F6F3EE]">Product Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleArrayValue('tags', tag)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  form.tags.includes(tag)
                    ? 'bg-[#F6F3EE] text-[#2F2F2F]'
                    : 'border border-white/10 bg-white/[0.03] text-[#E8E1D8]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-lg font-semibold text-[#F6F3EE]">Homepage Controls</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: 'visible', label: 'Visible on website' },
              { key: 'featured', label: 'Featured' },
              { key: 'showOnHomepage', label: 'Show on homepage' },
            ].map((toggle) => (
              <button
                key={toggle.key}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key as keyof typeof prev] }))}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  form[toggle.key as keyof typeof form]
                    ? 'border-[#2D332B]/45 bg-[#2D332B]/10 text-[#F6F3EE]'
                    : 'border-white/10 bg-white/[0.03] text-[#E8E1D8]/70'
                }`}
              >
                <div className="text-sm font-medium">{toggle.label}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em]">
                  {form[toggle.key as keyof typeof form] ? 'Enabled' : 'Disabled'}
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
}

function CategoryForm({
  initial,
  onSubmit,
}: {
  initial?: Category;
  onSubmit: (payload: Omit<Category, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<Category, 'id'>>(
    initial ?? { name: '', image: '', description: '', displayOrder: 1, productCount: 0 },
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category Name">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Display Order">
          <TextInput
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
          />
        </Field>
      </div>
      <Field label="Category Image">
        <TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
      </Field>
      <Field label="Description">
        <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <Field label="Product Count">
        <TextInput
          type="number"
          value={form.productCount}
          onChange={(e) => setForm({ ...form, productCount: Number(e.target.value) })}
        />
      </Field>
      <div className="flex justify-end">
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  );
}

function CollectionForm({
  initial,
  products,
  onSubmit,
}: {
  initial?: Collection;
  products: Product[];
  onSubmit: (payload: Omit<Collection, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<Collection, 'id'>>(
    initial ?? { name: '', description: '', productIds: [], featured: false, season: '' },
  );

  const toggleProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id) ? prev.productIds.filter((item) => item !== id) : [...prev.productIds, id],
    }));
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Collection Name">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Season">
          <TextInput value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} placeholder="Summer 2026" />
        </Field>
      </div>
      <Field label="Description">
        <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#E8E1D8]/55">Select Products</p>
        <div className="grid gap-3 md:grid-cols-2">
          {products.map((product) => {
            const active = form.productIds.includes(product.id);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active ? 'border-[#2D332B]/50 bg-[#2D332B]/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="text-sm font-medium text-[#F6F3EE]">{product.name}</div>
                <div className="mt-1 text-xs text-[#E8E1D8]/60">{product.category}</div>
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
        className={`rounded-2xl border px-4 py-3 text-sm transition ${
          form.featured ? 'border-[#2D332B]/45 bg-[#2D332B]/10 text-[#F6F3EE]' : 'border-white/10 text-[#E8E1D8]'
        }`}
      >
        {form.featured ? 'Featured Collection' : 'Mark as Featured'}
      </button>
      <div className="flex justify-end">
        <Button type="submit">Save Collection</Button>
      </div>
    </form>
  );
}

function DiscountForm({
  initial,
  onSubmit,
}: {
  initial?: Discount;
  onSubmit: (payload: Omit<Discount, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<Discount, 'id'>>(
    initial ?? { name: '', code: '', type: 'percentage', value: 10, expiresAt: '', active: true },
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Discount Name">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Code">
          <TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
        </Field>
        <Field label="Type">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Discount['type'] })}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </Select>
        </Field>
        <Field label="Value">
          <TextInput type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        </Field>
        <Field label="Expiration Date">
          <TextInput type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </Field>
      </div>
      <button
        type="button"
        onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
        className={`rounded-2xl border px-4 py-3 text-sm transition ${
          form.active ? 'border-[#2D332B]/45 bg-[#2D332B]/10 text-[#F6F3EE]' : 'border-white/10 text-[#E8E1D8]'
        }`}
      >
        {form.active ? 'Active' : 'Inactive'}
      </button>
      <div className="flex justify-end">
        <Button type="submit">Save Discount</Button>
      </div>
    </form>
  );
}

function SearchEmptyState({ query }: { query: string }) {
  return (
    <Panel className="text-center">
      <p className="text-lg font-medium text-[#F6F3EE]">No matches for “{query}”</p>
      <p className="mt-2 text-sm text-[#E8E1D8]/60">Try searching by name, SKU, order ID, or customer email.</p>
    </Panel>
  );
}

export default function AdminDashboardPage() {
  const {
    products,
    categories,
    collections,
    orders,
    customers,
    messages,
    websiteContent,
    mediaLibrary,
    discounts,
    settings,
    notifications,
    analytics,
    recentOrders,
    recentMessages,
    salesSeries,
    trafficSources,
    actions,
  } = useAdminData();

  const [activeSection, setActiveSection] = useState<AdminSectionId>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const deferredSearch = useDeferredValue(globalSearch);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [productCreateDefaults, setProductCreateDefaults] = useState<Partial<ProductDraft> | undefined>();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>();
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [contentDraft, setContentDraft] = useState<WebsiteContent>(websiteContent);
  const [settingsDraft, setSettingsDraft] = useState<StoreSettings>(settings);
  const [mediaDraft, setMediaDraft] = useState<Omit<MediaItem, 'id' | 'uploadedAt'>>({
    name: '',
    url: '',
    type: 'product',
  });
  const [productSort, setProductSort] = useState<{ key: 'name' | 'price' | 'stockQuantity'; direction: SortDirection }>({
    key: 'name',
    direction: 'asc',
  });
  const [ordersSort, setOrdersSort] = useState<{ key: 'createdAt' | 'totalPrice'; direction: SortDirection }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const navWithBadges = useMemo(
    () =>
      sections.map((item) => {
        if (isStorefrontPageSection(item.id)) {
          return { ...item, badge: products.filter(storefrontPageConfigs[item.id].matchesProduct).length };
        }
        if (item.id === 'messages') return { ...item, badge: analytics.unreadMessages };
        if (item.id === 'products') return { ...item, badge: analytics.featuredProducts };
        return item;
      }),
    [analytics.featuredProducts, analytics.unreadMessages, products],
  );

  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const toggleSort = <TKey extends string>(state: { key: TKey; direction: SortDirection }, key: TKey) => {
    if (state.key !== key) return { key, direction: 'asc' as SortDirection };
    return { key, direction: state.direction === 'asc' ? 'desc' : 'asc' };
  };

  const filteredProducts = useMemo(() => {
    const results = normalizedSearch
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(normalizedSearch) ||
            product.brand.toLowerCase().includes(normalizedSearch) ||
            product.sku.toLowerCase().includes(normalizedSearch) ||
            product.category.toLowerCase().includes(normalizedSearch),
        )
      : products;

    return [...results].sort((a, b) => {
      const direction = productSort.direction === 'asc' ? 1 : -1;
      const aValue = a[productSort.key];
      const bValue = b[productSort.key];
      if (typeof aValue === 'number' && typeof bValue === 'number') return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [normalizedSearch, productSort.direction, productSort.key, products]);

  const filteredOrders = useMemo(() => {
    const results = normalizedSearch
      ? orders.filter(
          (order) =>
            order.id.toLowerCase().includes(normalizedSearch) ||
            order.customerName.toLowerCase().includes(normalizedSearch) ||
            order.items.some((item) => item.productName.toLowerCase().includes(normalizedSearch)),
        )
      : orders;

    return [...results].sort((a, b) => {
      const direction = ordersSort.direction === 'asc' ? 1 : -1;
      if (ordersSort.key === 'createdAt') return (+new Date(a.createdAt) - +new Date(b.createdAt)) * direction;
      return (a.totalPrice - b.totalPrice) * direction;
    });
  }, [normalizedSearch, orders, ordersSort.direction, ordersSort.key]);

  const filteredCustomers = useMemo(
    () =>
      normalizedSearch
        ? customers.filter(
            (customer) =>
              customer.name.toLowerCase().includes(normalizedSearch) ||
              customer.email.toLowerCase().includes(normalizedSearch) ||
              customer.phone.toLowerCase().includes(normalizedSearch),
          )
        : customers,
    [customers, normalizedSearch],
  );

  const filteredMessages = useMemo(
    () =>
      normalizedSearch
        ? messages.filter(
            (message) =>
              message.name.toLowerCase().includes(normalizedSearch) ||
              message.subject.toLowerCase().includes(normalizedSearch) ||
              message.email.toLowerCase().includes(normalizedSearch),
          )
        : messages,
    [messages, normalizedSearch],
  );

  const filteredCategories = useMemo(
    () => (normalizedSearch ? categories.filter((item) => item.name.toLowerCase().includes(normalizedSearch)) : categories),
    [categories, normalizedSearch],
  );

  const filteredCollections = useMemo(
    () => (normalizedSearch ? collections.filter((item) => item.name.toLowerCase().includes(normalizedSearch)) : collections),
    [collections, normalizedSearch],
  );

  const filteredMedia = useMemo(
    () =>
      normalizedSearch
        ? mediaLibrary.filter(
            (item) => item.name.toLowerCase().includes(normalizedSearch) || item.type.toLowerCase().includes(normalizedSearch),
          )
        : mediaLibrary,
    [mediaLibrary, normalizedSearch],
  );

  const filteredDiscounts = useMemo(
    () =>
      normalizedSearch
        ? discounts.filter(
            (item) => item.name.toLowerCase().includes(normalizedSearch) || item.code.toLowerCase().includes(normalizedSearch),
          )
        : discounts,
    [discounts, normalizedSearch],
  );

  const searchHasNoResults =
    normalizedSearch.length > 0 &&
    [
      filteredProducts.length,
      filteredOrders.length,
      filteredCustomers.length,
      filteredMessages.length,
      filteredCategories.length,
      filteredCollections.length,
      filteredMedia.length,
      filteredDiscounts.length,
    ].every((count) => count === 0);

  const openProductCreate = (defaults?: Partial<ProductDraft>) => {
    setEditingProduct(undefined);
    setProductCreateDefaults(defaults);
    setProductModalOpen(true);
  };

  const openProductEdit = (product: Product) => {
    setEditingProduct(product);
    setProductCreateDefaults(undefined);
    setProductModalOpen(true);
  };

  const storefrontPageProducts = useMemo(
    () =>
      storefrontPageSections.reduce(
        (acc, sectionId) => {
          acc[sectionId] = filteredProducts.filter(storefrontPageConfigs[sectionId].matchesProduct);
          return acc;
        },
        {} as Record<StorefrontPageSectionId, Product[]>,
      ),
    [filteredProducts],
  );

  const removeProductFromStorefrontPage = (sectionId: StorefrontPageSectionId, product: Product) => {
    if (sectionId === 'pageHome') {
      actions.updateProduct(product.id, { ...toProductPayload(product), showOnHomepage: false });
      return;
    }

    if (sectionId === 'pageNewArrivals') {
      actions.updateProduct(product.id, {
        ...toProductPayload(product),
        tags: product.tags.filter((tag) => tag !== 'New'),
      });
      return;
    }

    actions.deleteProduct(product.id);
  };

  const dashboardView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Overview"
        title="Operational pulse for the storefront"
        description="Track catalog health, orders, customer growth, and inbound requests from a single premium control center."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={String(analytics.totalProducts)} delta={`${analytics.publishedProducts} published`} hint="Ready for merchandising and campaigns." />
        <StatCard label="Total Orders" value={String(analytics.totalOrders)} delta="+12% vs last month" hint="Recent order velocity remains strong." />
        <StatCard label="Revenue" value={formatMoney(analytics.revenue)} delta="+8.4% MTD" hint="Includes paid and pending mock orders." />
        <StatCard label="New Customers" value={String(analytics.newCustomers)} delta="+3 this week" hint="Acquisition is strongest from Instagram." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <MiniAreaChart points={salesSeries} />
        <Panel>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#E8E1D8]/60">Traffic mix</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#F6F3EE]">Channel split</h3>
            </div>
            <Badge tone="green">Healthy acquisition</Badge>
          </div>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#F6F3EE]">{source.source}</span>
                  <span className="text-[#E8E1D8]/60">{source.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/6">
                  <div className="h-2 rounded-full bg-[linear-gradient(90deg,#2D332B,#A8B57A)]" style={{ width: `${source.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
        <BarsChart points={salesSeries} />
        <Panel>
          <p className="text-sm text-[#E8E1D8]/60">Catalog health</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E8E1D8]/60">Featured products</span>
                <Badge tone="gold">{analytics.featuredProducts}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E8E1D8]/60">Hidden products</span>
                <Badge tone="red">{analytics.hiddenProducts}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E8E1D8]/60">Low stock alerts</span>
                <Badge tone="blue">{analytics.lowStockProducts}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E8E1D8]/60">Active discounts</span>
                <Badge tone="green">{analytics.activeDiscounts}</Badge>
              </div>
            </div>
          </div>
        </Panel>
        <Panel>
          <p className="text-sm text-[#E8E1D8]/60">Recent messages</p>
          <div className="mt-6 space-y-3">
            {recentMessages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => setSelectedMessage(message)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-[#2D332B]/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#F6F3EE]">{message.subject}</p>
                    <p className="mt-1 text-xs text-[#E8E1D8]/55">{message.name}</p>
                  </div>
                  <Badge tone={message.read ? 'default' : 'gold'}>{message.read ? 'Read' : 'Unread'}</Badge>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#F6F3EE]">Recent orders</h3>
            <Button variant="ghost" onClick={() => setActiveSection('orders')}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-[#2D332B]/35"
              >
                <div>
                  <p className="text-sm font-medium text-[#F6F3EE]">{order.id}</p>
                  <p className="mt-1 text-xs text-[#E8E1D8]/55">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#F6F3EE]">{formatMoney(order.totalPrice)}</p>
                  <p className="mt-1 text-xs text-[#E8E1D8]/55">{order.orderStatus}</p>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#F6F3EE]">Quick actions</h3>
            <Badge tone="blue">Admin tools</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Package, label: 'New product', section: 'products' as const, action: () => openProductCreate() },
              { icon: MenuSquare, label: 'Manage collections', section: 'collections' as const },
              { icon: BadgePercent, label: 'Create discount', section: 'discounts' as const, action: () => setDiscountModalOpen(true) },
              { icon: Settings2, label: 'Store settings', section: 'settings' as const },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveSection(item.section);
                  item.action?.();
                }}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-[#2D332B]/35"
              >
                <item.icon className="h-5 w-5 text-[#2D332B]" />
                <p className="mt-4 text-base font-medium text-[#F6F3EE]">{item.label}</p>
                <p className="mt-1 text-sm text-[#E8E1D8]/55">Open section and continue editing.</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const renderStorefrontPageTable = (sectionId: StorefrontPageSectionId) => {
    const pageConfig = storefrontPageConfigs[sectionId];
    const pageProducts = storefrontPageProducts[sectionId];

    if (normalizedSearch.length > 0 && pageProducts.length === 0) {
      return <SearchEmptyState query={deferredSearch} />;
    }

    if (pageProducts.length === 0) {
      return (
        <Panel className="text-center">
          <p className="text-lg font-medium text-[#F6F3EE]">{pageConfig.emptyState}</p>
          <p className="mt-2 text-sm text-[#E8E1D8]/60">Use the add button to create the first item for this page.</p>
          <div className="mt-5 flex justify-center">
            <Button onClick={() => openProductCreate(pageConfig.createDefaults)}>
              <Plus className="h-4 w-4" />
              {pageConfig.addLabel}
            </Button>
          </div>
        </Panel>
      );
    }

    return (
      <DataTable
        columns={[
          { key: 'product', label: 'Product' },
          { key: 'price', label: 'Price' },
          { key: 'inventory', label: 'Inventory' },
          { key: 'tags', label: 'Tags' },
          { key: 'updated', label: 'Updated' },
          { key: 'actions', label: 'Actions' },
        ]}
      >
        {pageProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-start gap-3">
                <img
                  src={product.images[product.mainImageIndex] || product.images[0]}
                  alt={product.name}
                  className="h-16 w-14 rounded-2xl object-cover"
                />
                <div>
                  <p className="font-medium text-[#F6F3EE]">{product.name}</p>
                  <p className="mt-1 text-xs text-[#E8E1D8]/55">
                    {product.brand} • {product.category} • {product.sku}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <p className="text-[#F6F3EE]">{formatMoney(product.price, product.currency)}</p>
              {product.discountPrice ? (
                <p className="mt-1 text-xs text-[#E8E1D8]/55">Sale {formatMoney(product.discountPrice, product.currency)}</p>
              ) : null}
            </TableCell>
            <TableCell>
              <p className="text-[#F6F3EE]">{product.stockQuantity} units</p>
              <p className="mt-1 text-xs text-[#E8E1D8]/55">{product.availability}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <Badge tone={product.featured ? 'gold' : 'default'}>{product.featured ? 'Featured' : product.status}</Badge>
                {!product.visible ? <Badge tone="red">Hidden</Badge> : null}
                {product.showOnHomepage ? <Badge tone="blue">Homepage</Badge> : null}
              </div>
            </TableCell>
            <TableCell>
              <p className="text-[#F6F3EE]">{formatDate(product.updatedAt)}</p>
              <p className="mt-1 text-xs text-[#E8E1D8]/55">{product.tags.join(', ') || 'No tags'}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => openProductEdit(product)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                {pageConfig.removeLabel ? (
                  <Button variant="ghost" onClick={() => removeProductFromStorefrontPage(sectionId, product)}>
                    <EyeOff className="h-4 w-4" />
                    {pageConfig.removeLabel}
                  </Button>
                ) : null}
                <Button variant="danger" onClick={() => actions.deleteProduct(product.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    );
  };

  const homePageProducts = storefrontPageProducts.pageHome;
  const homePageView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Storefront Page"
        title={storefrontPageConfigs.pageHome.title}
        description={storefrontPageConfigs.pageHome.description}
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => setActiveSection('content')}>
              Open Full Content
            </Button>
            <Button onClick={() => openProductCreate(storefrontPageConfigs.pageHome.createDefaults)}>
              <Plus className="h-4 w-4" />
              {storefrontPageConfigs.pageHome.addLabel}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#F6F3EE]">Homepage content</h3>
              <p className="mt-2 text-sm text-[#E8E1D8]/60">Update the hero and banner copy shown on the storefront home page.</p>
            </div>
            <Button onClick={() => actions.updateWebsiteContent(contentDraft)}>Save Home Content</Button>
          </div>

          <Field label="Hero Title">
            <TextInput value={contentDraft.heroTitle} onChange={(e) => setContentDraft({ ...contentDraft, heroTitle: e.target.value })} />
          </Field>
          <Field label="Hero Subtitle">
            <TextArea value={contentDraft.heroSubtitle} onChange={(e) => setContentDraft({ ...contentDraft, heroSubtitle: e.target.value })} />
          </Field>
          <Field label="Homepage Banner Title">
            <TextInput
              value={contentDraft.homepageBannerTitle}
              onChange={(e) => setContentDraft({ ...contentDraft, homepageBannerTitle: e.target.value })}
            />
          </Field>
          <Field label="Homepage Banner Text">
            <TextArea
              value={contentDraft.homepageBannerText}
              onChange={(e) => setContentDraft({ ...contentDraft, homepageBannerText: e.target.value })}
            />
          </Field>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Homepage items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">{homePageProducts.length}</p>
            <p className="mt-2 text-sm text-[#E8E1D8]/55">Products currently featured on the front page.</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Published items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
              {homePageProducts.filter((product) => product.status === 'Published').length}
            </p>
            <p className="mt-2 text-sm text-[#E8E1D8]/55">Ready to appear in the live storefront presentation.</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Featured items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
              {homePageProducts.filter((product) => product.featured).length}
            </p>
            <p className="mt-2 text-sm text-[#E8E1D8]/55">Marked as premium merchandising moments.</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Hidden items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
              {homePageProducts.filter((product) => !product.visible).length}
            </p>
            <p className="mt-2 text-sm text-[#E8E1D8]/55">Still assigned to Home, but hidden from the website.</p>
          </Panel>
        </div>
      </div>

      {renderStorefrontPageTable('pageHome')}
    </div>
  );

  const renderStorefrontCatalogView = (sectionId: Exclude<StorefrontPageSectionId, 'pageHome'>) => {
    const pageConfig = storefrontPageConfigs[sectionId];
    const pageProducts = storefrontPageProducts[sectionId];

    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Storefront Page"
          title={pageConfig.title}
          description={pageConfig.description}
          action={
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => setActiveSection('products')}>
                Open Full Catalog
              </Button>
              <Button onClick={() => openProductCreate(pageConfig.createDefaults)}>
                <Plus className="h-4 w-4" />
                {pageConfig.addLabel}
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Items on page</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">{pageProducts.length}</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Published items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
              {pageProducts.filter((product) => product.status === 'Published').length}
            </p>
          </Panel>
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Featured items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
              {pageProducts.filter((product) => product.featured).length}
            </p>
          </Panel>
          <Panel>
            <p className="text-sm text-[#E8E1D8]/60">Hidden items</p>
            <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
              {pageProducts.filter((product) => !product.visible).length}
            </p>
          </Panel>
        </div>

        {renderStorefrontPageTable(sectionId)}
      </div>
    );
  };

  const productsView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Catalog"
        title="Products management"
        description="Create, edit, hide, feature, and merchandise every product without touching the codebase."
        action={
          <Button onClick={() => openProductCreate()}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />

      {searchHasNoResults && activeSection === 'products' ? (
        <SearchEmptyState query={deferredSearch} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Panel>
              <p className="text-sm text-[#E8E1D8]/60">Visible on website</p>
              <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
                {products.filter((item) => item.visible).length}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-[#E8E1D8]/60">Featured products</p>
              <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
                {products.filter((item) => item.featured).length}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-[#E8E1D8]/60">Draft items</p>
              <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
                {products.filter((item) => item.status === 'Draft').length}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-[#E8E1D8]/60">Low stock</p>
              <p className="mt-4 text-3xl font-semibold text-[#F6F3EE]">
                {products.filter((item) => item.stockQuantity <= 10).length}
              </p>
            </Panel>
          </div>

          <DataTable
            columns={[
              { key: 'product', label: 'Product' },
              {
                key: 'price',
                label: 'Price',
                sortable: true,
                onSort: () => setProductSort((prev) => toggleSort(prev, 'price')),
                active: productSort.key === 'price',
              },
              { key: 'inventory', label: 'Inventory' },
              { key: 'tags', label: 'Tags' },
              {
                key: 'name',
                label: 'Updated',
                sortable: true,
                onSort: () => setProductSort((prev) => toggleSort(prev, 'name')),
                active: productSort.key === 'name',
              },
              { key: 'actions', label: 'Actions' },
            ]}
          >
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <img
                      src={product.images[product.mainImageIndex] || product.images[0]}
                      alt={product.name}
                      className="h-16 w-14 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-medium text-[#F6F3EE]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#E8E1D8]/55">
                        {product.brand} • {product.category} • {product.sku}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-[#F6F3EE]">{formatMoney(product.price, product.currency)}</p>
                  {product.discountPrice ? (
                    <p className="mt-1 text-xs text-[#E8E1D8]/55">Sale {formatMoney(product.discountPrice, product.currency)}</p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <p className="text-[#F6F3EE]">{product.stockQuantity} units</p>
                  <p className="mt-1 text-xs text-[#E8E1D8]/55">{product.availability}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={product.featured ? 'gold' : 'default'}>{product.featured ? 'Featured' : product.status}</Badge>
                    {!product.visible ? <Badge tone="red">Hidden</Badge> : null}
                    {product.showOnHomepage ? <Badge tone="blue">Homepage</Badge> : null}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-[#F6F3EE]">{formatDate(product.updatedAt)}</p>
                  <p className="mt-1 text-xs text-[#E8E1D8]/55">{product.tags.join(', ') || 'No tags'}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => openProductEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => actions.toggleProductVisibility(product.id)}>
                      {product.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" onClick={() => actions.toggleProductFeatured(product.id)}>
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" onClick={() => actions.deleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </DataTable>
        </>
      )}
    </div>
  );

  const categoriesView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Taxonomy"
        title="Categories management"
        description="Structure the catalog, control display order, and maintain visual landing points for product discovery."
        action={
          <Button
            onClick={() => {
              setEditingCategory(undefined);
              setCategoryModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredCategories.map((category) => (
          <Panel key={category.id} className="overflow-hidden p-0">
            <img src={category.image} alt={category.name} className="h-48 w-full object-cover" />
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-[#F6F3EE]">{category.name}</h3>
                  <p className="mt-2 text-sm text-[#E8E1D8]/60">{category.description}</p>
                </div>
                <Badge tone="blue">#{category.displayOrder}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#E8E1D8]/55">{category.productCount} linked products</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" onClick={() => actions.deleteCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );

  const collectionsView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Merchandising"
        title="Collections"
        description="Curate product groupings like New Arrivals, Best Sellers, or seasonal drops and control what appears together."
        action={
          <Button
            onClick={() => {
              setEditingCollection(undefined);
              setCollectionModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Collection
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {filteredCollections.map((collection) => (
          <Panel key={collection.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-[#F6F3EE]">{collection.name}</h3>
                <p className="mt-2 text-sm text-[#E8E1D8]/60">{collection.description}</p>
              </div>
              {collection.featured ? <Badge tone="gold">Featured</Badge> : null}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="blue">{collection.season}</Badge>
              <Badge>{collection.productIds.length} products</Badge>
            </div>
            <div className="mt-5 flex justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingCollection(collection);
                  setCollectionModalOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => actions.deleteCollection(collection.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );

  const ordersView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Commerce"
        title="Orders"
        description="Monitor purchases, payment state, fulfillment, and inspect complete order details with customer and item history."
      />

      <DataTable
        columns={[
          {
            key: 'createdAt',
            label: 'Order',
            sortable: true,
            onSort: () => setOrdersSort((prev) => toggleSort(prev, 'createdAt')),
            active: ordersSort.key === 'createdAt',
          },
          { key: 'customer', label: 'Customer' },
          { key: 'items', label: 'Product Purchased' },
          {
            key: 'totalPrice',
            label: 'Total',
            sortable: true,
            onSort: () => setOrdersSort((prev) => toggleSort(prev, 'totalPrice')),
            active: ordersSort.key === 'totalPrice',
          },
          { key: 'payment', label: 'Payment' },
          { key: 'status', label: 'Order Status' },
          { key: 'actions', label: 'Details' },
        ]}
      >
        {filteredOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <p className="font-medium text-[#F6F3EE]">{order.id}</p>
              <p className="mt-1 text-xs text-[#E8E1D8]/55">{formatDate(order.createdAt)}</p>
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{order.items.map((item) => item.productName).join(', ')}</TableCell>
            <TableCell className="text-[#F6F3EE]">{formatMoney(order.totalPrice)}</TableCell>
            <TableCell>
              <Badge tone={order.paymentStatus === 'Paid' ? 'green' : order.paymentStatus === 'Refunded' ? 'red' : 'blue'}>
                {order.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <Select
                value={order.orderStatus}
                onChange={(e) => actions.updateOrderStatus(order.id, e.target.value as Order['orderStatus'])}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Select>
            </TableCell>
            <TableCell>
              <Button variant="ghost" onClick={() => setSelectedOrder(order)}>
                Open
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </div>
  );

  const customersView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Audience"
        title="Customers"
        description="Review customer profiles, order value, and segment performance without leaving the admin workspace."
      />

      <DataTable
        columns={[
          { key: 'customer', label: 'Customer' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'orders', label: 'Orders' },
          { key: 'spent', label: 'Total Spent' },
        ]}
      >
        {filteredCustomers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-[#F6F3EE]">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-[#F6F3EE]">{customer.name}</p>
                  <p className="mt-1 text-xs text-[#E8E1D8]/55">{customer.segment}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.ordersCount}</TableCell>
            <TableCell className="text-[#F6F3EE]">{formatMoney(customer.totalSpent)}</TableCell>
          </TableRow>
        ))}
      </DataTable>
    </div>
  );

  const messagesView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Inbox"
        title="Messages"
        description="Read messages from the contact page, keep your inbox organized, and clear handled requests."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Panel className="p-0">
          <div className="divide-y divide-white/8">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => {
                  setSelectedMessage(message);
                  actions.markMessageRead(message.id);
                }}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/[0.03]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-[#F6F3EE]">{message.subject}</p>
                    {!message.read ? <Badge tone="gold">New</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-[#E8E1D8]/60">{message.name} • {message.email}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#E8E1D8]/50">{message.message}</p>
                </div>
                <span className="text-xs text-[#E8E1D8]/45">{formatDate(message.createdAt)}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          {selectedMessage ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#E8E1D8]/55">{selectedMessage.email}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#F6F3EE]">{selectedMessage.subject}</h3>
                </div>
                <Button variant="danger" onClick={() => actions.deleteMessage(selectedMessage.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#E8E1D8]/70">{selectedMessage.message}</p>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center text-center">
              <div>
                <MessageSquare className="mx-auto h-6 w-6 text-[#2D332B]" />
                <p className="mt-4 text-lg font-medium text-[#F6F3EE]">Select a message</p>
                <p className="mt-2 text-sm text-[#E8E1D8]/55">Message details appear here.</p>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );

  const contentView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="CMS"
        title="Website content"
        description="Edit hero copy, homepage banners, about section, contact details, and footer links from one place."
        action={
          <Button
            onClick={() => {
              actions.updateWebsiteContent(contentDraft);
            }}
          >
            Save Content
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="space-y-4">
          <Field label="Hero Title">
            <TextInput value={contentDraft.heroTitle} onChange={(e) => setContentDraft({ ...contentDraft, heroTitle: e.target.value })} />
          </Field>
          <Field label="Hero Subtitle">
            <TextArea
              value={contentDraft.heroSubtitle}
              onChange={(e) => setContentDraft({ ...contentDraft, heroSubtitle: e.target.value })}
            />
          </Field>
          <Field label="Homepage Banner Title">
            <TextInput
              value={contentDraft.homepageBannerTitle}
              onChange={(e) => setContentDraft({ ...contentDraft, homepageBannerTitle: e.target.value })}
            />
          </Field>
          <Field label="Homepage Banner Text">
            <TextArea
              value={contentDraft.homepageBannerText}
              onChange={(e) => setContentDraft({ ...contentDraft, homepageBannerText: e.target.value })}
            />
          </Field>
        </Panel>

        <Panel className="space-y-4">
          <Field label="About Title">
            <TextInput value={contentDraft.aboutTitle} onChange={(e) => setContentDraft({ ...contentDraft, aboutTitle: e.target.value })} />
          </Field>
          <Field label="About Text">
            <TextArea value={contentDraft.aboutText} onChange={(e) => setContentDraft({ ...contentDraft, aboutText: e.target.value })} />
          </Field>
          <Field label="Contact Email">
            <TextInput
              value={contentDraft.contactEmail}
              onChange={(e) => setContentDraft({ ...contentDraft, contactEmail: e.target.value })}
            />
          </Field>
          <Field label="Contact Phone">
            <TextInput
              value={contentDraft.contactPhone}
              onChange={(e) => setContentDraft({ ...contentDraft, contactPhone: e.target.value })}
            />
          </Field>
          <Field label="Footer Links">
            <TextInput
              value={contentDraft.footerLinks.join(', ')}
              onChange={(e) =>
                setContentDraft({
                  ...contentDraft,
                  footerLinks: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                })
              }
            />
          </Field>
        </Panel>
      </div>
    </div>
  );

  const mediaView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Assets"
        title="Media library"
        description="Keep product photos, campaign banners, and website graphics in one centralized image workspace."
      />

      <Panel className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Asset Name">
            <TextInput value={mediaDraft.name} onChange={(e) => setMediaDraft({ ...mediaDraft, name: e.target.value })} />
          </Field>
          <Field label="Image URL">
            <TextInput value={mediaDraft.url} onChange={(e) => setMediaDraft({ ...mediaDraft, url: e.target.value })} />
          </Field>
          <Field label="Type">
            <Select value={mediaDraft.type} onChange={(e) => setMediaDraft({ ...mediaDraft, type: e.target.value as MediaItem['type'] })}>
              <option value="product">Product</option>
              <option value="banner">Banner</option>
              <option value="graphic">Graphic</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={() => {
                if (!mediaDraft.name.trim() || !mediaDraft.url.trim()) return;
                actions.addMediaItem(mediaDraft);
                setMediaDraft({ name: '', url: '', type: 'product' });
              }}
            >
              <Archive className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredMedia.map((item) => (
          <Panel key={item.id} className="overflow-hidden p-0">
            <img src={item.url} alt={item.name} className="h-44 w-full object-cover" />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[#F6F3EE]">{item.name}</p>
                <Badge tone="blue">{item.type}</Badge>
              </div>
              <p className="text-xs text-[#E8E1D8]/50">{formatDate(item.uploadedAt)}</p>
              <Button variant="danger" className="w-full" onClick={() => actions.deleteMediaItem(item.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );

  const discountsView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Promotions"
        title="Discounts"
        description="Create and manage promotional codes with percentage or fixed pricing rules and expiration handling."
        action={
          <Button
            onClick={() => {
              setEditingDiscount(undefined);
              setDiscountModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Discount
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredDiscounts.map((discount) => (
          <Panel key={discount.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-[#F6F3EE]">{discount.name}</h3>
                <p className="mt-2 text-sm text-[#E8E1D8]/60">{discount.code}</p>
              </div>
              <Badge tone={discount.active ? 'green' : 'default'}>{discount.active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="gold">
                {discount.type === 'percentage' ? `${discount.value}% off` : `${formatMoney(discount.value)} off`}
              </Badge>
              <Badge tone="blue">Expires {formatDate(discount.expiresAt)}</Badge>
            </div>
            <div className="mt-5 flex justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingDiscount(discount);
                  setDiscountModalOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => actions.deleteDiscount(discount.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );

  const settingsView = (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Configuration"
        title="Settings"
        description="Manage store identity, logo, currency, contact email, and social channels from the same admin experience."
        action={<Button onClick={() => actions.updateSettings(settingsDraft)}>Save Settings</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel className="space-y-4">
          <Field label="Store Name">
            <TextInput value={settingsDraft.storeName} onChange={(e) => setSettingsDraft({ ...settingsDraft, storeName: e.target.value })} />
          </Field>
          <Field label="Logo URL">
            <TextInput value={settingsDraft.logoUrl} onChange={(e) => setSettingsDraft({ ...settingsDraft, logoUrl: e.target.value })} />
          </Field>
          <Field label="Currency">
            <TextInput value={settingsDraft.currency} onChange={(e) => setSettingsDraft({ ...settingsDraft, currency: e.target.value.toUpperCase() })} />
          </Field>
          <Field label="Contact Email">
            <TextInput
              value={settingsDraft.contactEmail}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, contactEmail: e.target.value })}
            />
          </Field>
        </Panel>

        <Panel className="space-y-4">
          <Field label="Instagram">
            <TextInput value={settingsDraft.instagram} onChange={(e) => setSettingsDraft({ ...settingsDraft, instagram: e.target.value })} />
          </Field>
          <Field label="Facebook">
            <TextInput value={settingsDraft.facebook} onChange={(e) => setSettingsDraft({ ...settingsDraft, facebook: e.target.value })} />
          </Field>
          <Field label="TikTok">
            <TextInput value={settingsDraft.tiktok} onChange={(e) => setSettingsDraft({ ...settingsDraft, tiktok: e.target.value })} />
          </Field>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <img src={settingsDraft.logoUrl} alt={settingsDraft.storeName} className="h-44 w-full object-cover bg-[#2F2F2F] object-contain p-8" />
          </div>
        </Panel>
      </div>
    </div>
  );

  const sectionContent = {
    dashboard: dashboardView,
    pageHome: homePageView,
    pageNewArrivals: renderStorefrontCatalogView('pageNewArrivals'),
    pageSuits: renderStorefrontCatalogView('pageSuits'),
    pageShoes: renderStorefrontCatalogView('pageShoes'),
    pageAccessories: renderStorefrontCatalogView('pageAccessories'),
    products: productsView,
    categories: categoriesView,
    collections: collectionsView,
    orders: ordersView,
    customers: customersView,
    messages: messagesView,
    content: contentView,
    media: mediaView,
    discounts: discountsView,
    settings: settingsView,
  } satisfies Record<AdminSectionId, React.ReactNode>;

  return (
    <>
      <AdminShell
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        navItems={navWithBadges}
        onQuickAdd={() => openProductCreate()}
        searchValue={globalSearch}
        onSearchChange={(value) => startTransition(() => setGlobalSearch(value))}
        notifications={notifications}
        onNotificationDismiss={actions.markNotificationRead}
      >
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {sectionContent[activeSection]}
        </motion.div>
      </AdminShell>

      <Modal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(undefined);
          setProductCreateDefaults(undefined);
        }}
        title={editingProduct ? 'Edit item' : 'Add item'}
        description="Manage name, price, color, size, multiple images, inventory, tags, and storefront visibility."
      >
        <ProductEditorForm
          initial={editingProduct}
          defaults={productCreateDefaults}
          onCancel={() => {
            setProductModalOpen(false);
            setEditingProduct(undefined);
            setProductCreateDefaults(undefined);
          }}
          onSubmit={(payload) => {
            if (editingProduct) actions.updateProduct(editingProduct.id, payload);
            else actions.addProduct(payload);
            setEditingProduct(undefined);
            setProductCreateDefaults(undefined);
            setProductModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit category' : 'Add category'}
      >
        <CategoryForm
          initial={editingCategory}
          onSubmit={(payload) => {
            if (editingCategory) actions.updateCategory(editingCategory.id, payload);
            else actions.addCategory(payload);
            setCategoryModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        title={editingCollection ? 'Edit collection' : 'Add collection'}
      >
        <CollectionForm
          initial={editingCollection}
          products={products}
          onSubmit={(payload) => {
            if (editingCollection) actions.updateCollection(editingCollection.id, payload);
            else actions.addCollection(payload);
            setCollectionModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        open={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
        title={editingDiscount ? 'Edit discount' : 'Create discount'}
      >
        <DiscountForm
          initial={editingDiscount}
          onSubmit={(payload) => {
            if (editingDiscount) actions.updateDiscount(editingDiscount.id, payload);
            else actions.addDiscount(payload);
            setDiscountModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.id ?? 'Order details'}
        description={selectedOrder ? `${selectedOrder.customerName} • ${formatDate(selectedOrder.createdAt)}` : undefined}
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Panel>
                <p className="text-sm text-[#E8E1D8]/60">Customer</p>
                <p className="mt-3 text-xl font-semibold text-[#F6F3EE]">{selectedOrder.customerName}</p>
              </Panel>
              <Panel>
                <p className="text-sm text-[#E8E1D8]/60">Payment</p>
                <p className="mt-3 text-xl font-semibold text-[#F6F3EE]">{selectedOrder.paymentStatus}</p>
              </Panel>
              <Panel>
                <p className="text-sm text-[#E8E1D8]/60">Total</p>
                <p className="mt-3 text-xl font-semibold text-[#F6F3EE]">{formatMoney(selectedOrder.totalPrice)}</p>
              </Panel>
            </div>

            <Panel>
              <h3 className="text-lg font-semibold text-[#F6F3EE]">Items</h3>
              <div className="mt-4 space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="font-medium text-[#F6F3EE]">{item.productName}</p>
                      <p className="mt-1 text-xs text-[#E8E1D8]/55">
                        Qty {item.quantity} • {item.size} • {item.color}
                      </p>
                    </div>
                    <p className="text-[#F6F3EE]">{formatMoney(item.price)}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="grid gap-4 md:grid-cols-2">
              <Panel>
                <h3 className="text-lg font-semibold text-[#F6F3EE]">Shipping address</h3>
                <p className="mt-4 text-sm leading-7 text-[#E8E1D8]/65">{selectedOrder.shippingAddress}</p>
              </Panel>
              <Panel>
                <h3 className="text-lg font-semibold text-[#F6F3EE]">Timeline</h3>
                <div className="mt-4 space-y-3">
                  {selectedOrder.timeline.map((entry, index) => (
                    <div key={`${entry}-${index}`} className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2D332B]" />
                      <p className="text-sm text-[#E8E1D8]/65">{entry}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={selectedMessage !== null && activeSection !== 'messages'}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject ?? 'Message'}
        description={selectedMessage ? `${selectedMessage.name} • ${selectedMessage.email}` : undefined}
      >
        {selectedMessage ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#2D332B]" />
              <p className="text-sm text-[#E8E1D8]/60">{formatDate(selectedMessage.createdAt)}</p>
            </div>
            <Panel>
              <p className="text-sm leading-7 text-[#E8E1D8]/70">{selectedMessage.message}</p>
            </Panel>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
