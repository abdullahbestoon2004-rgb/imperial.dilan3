import { useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Eye,
  ImagePlus,
  Layers3,
  Package2,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import type { Product, ProductDraft, ProductStatus, ProductSubcategory, ProductVariant } from '../types';

const categoryOptions = ['Suits', 'Shirts', 'Pants', 'Shoes', 'Accessories', 'Jackets'] as const;
const subcategoryOptions: ProductSubcategory[] = ['Formal', 'Casual', 'Seasonal'];
const variantSizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '40', '41', '42', '43', '44', 'One Size'];
const editorTabs = [
  { id: 'general', label: 'General Info', icon: Sparkles },
  { id: 'media', label: 'Media', icon: ImagePlus },
  { id: 'pricing', label: 'Pricing & Stock', icon: Package2 },
  { id: 'variants', label: 'Variants', icon: Layers3 },
  { id: 'visibility', label: 'Tags & Visibility', icon: Tag },
  { id: 'seo', label: 'SEO', icon: Search },
] as const;

const defaultImageUrl =
  'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80';

type EditorTabId = (typeof editorTabs)[number]['id'];

type ProductEditorFormProps = {
  initial?: Product;
  defaults?: Partial<ProductDraft>;
  onCancel: () => void;
  onSubmit: (payload: ProductDraft) => void;
};

function createLocalId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function colorNameToHex(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes('black') || normalized.includes('obsidian')) return '#111111';
  if (normalized.includes('white')) return '#f5f1ea';
  if (normalized.includes('navy') || normalized.includes('blue')) return '#2f4f6f';
  if (normalized.includes('gray') || normalized.includes('grey')) return '#7a7a7a';
  if (normalized.includes('beige') || normalized.includes('sand')) return '#d6c4a1';
  if (normalized.includes('brown') || normalized.includes('walnut')) return '#6f4e37';
  if (normalized.includes('green') || normalized.includes('olive')) return '#6b705c';
  if (normalized.includes('red') || normalized.includes('burgundy')) return '#7b2d26';
  if (normalized.includes('gold') || normalized.includes('champagne')) return '#bfa06a';

  return '#8d7b68';
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

function createVariant(partial?: Partial<ProductVariant>): ProductVariant {
  return {
    id: partial?.id ?? createLocalId('variant'),
    size: partial?.size ?? 'M',
    colorName: partial?.colorName ?? 'Signature Olive',
    colorHex: partial?.colorHex ?? '#6b705c',
    stock: partial?.stock ?? 0,
    priceOverride: partial?.priceOverride ?? null,
  };
}

function buildVariantsFromProduct(product: ProductDraft): ProductVariant[] {
  if (product.variants?.length) {
    return product.variants.map((variant) => createVariant(variant));
  }

  const sizes = product.sizes.length ? product.sizes : ['One Size'];
  const colors = product.colors.length ? product.colors : ['Signature Olive'];
  const combinations = sizes.flatMap((size) =>
    colors.map((colorName) =>
      createVariant({
        size,
        colorName,
        colorHex: colorNameToHex(colorName),
      }),
    ),
  );

  if (combinations.length === 0) {
    return [createVariant()];
  }

  const baseStock = product.stockQuantity > 0 ? Math.floor(product.stockQuantity / combinations.length) : 0;
  const remainder = product.stockQuantity > 0 ? product.stockQuantity % combinations.length : 0;

  return combinations.map((variant, index) => ({
    ...variant,
    stock: baseStock + (index < remainder ? 1 : 0),
  }));
}

function deriveProductType(category: string): Product['productType'] {
  return category === 'Accessories' ? 'Accessory' : 'Clothing';
}

function buildDraft(initial?: Product, defaults?: Partial<ProductDraft>): ProductDraft {
  const baseDraft: ProductDraft = {
    name: '',
    brand: 'Imperial Dilan',
    description: '',
    category: 'Suits',
    subcategory: 'Formal',
    productType: 'Clothing',
    price: 0,
    discountPrice: null,
    currency: 'USD',
    stockQuantity: 0,
    sku: '',
    availability: 'In Stock',
    sizes: [],
    colors: [],
    variants: [],
    images: [],
    mainImageIndex: 0,
    tags: [],
    status: 'Draft',
    showOnHomepage: false,
    featured: false,
    visible: true,
    slug: '',
    metaTitle: '',
    metaDescription: '',
  };

  const merged = {
    ...baseDraft,
    ...(initial ? { ...initial } : {}),
    ...(defaults ?? {}),
  };

  return {
    ...merged,
    sizes: merged.sizes ? [...merged.sizes] : [],
    colors: merged.colors ? [...merged.colors] : [],
    images: merged.images ? [...merged.images] : [],
    tags: merged.tags ? [...merged.tags] : [],
    variants: buildVariantsFromProduct(merged),
  };
}

function EditorField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#605444]">{label}</span>
        {hint ? <span className="text-xs text-[#8a7c6b]">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function EditorInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-[#d8ccb8] bg-white px-4 text-sm text-[#1d1a17] outline-none transition placeholder:text-[#9b8f80] focus:border-[#6b705c] focus:ring-4 focus:ring-[#dfe4d6] ${props.className ?? ''}`}
    />
  );
}

function EditorTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[140px] w-full rounded-2xl border border-[#d8ccb8] bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition placeholder:text-[#9b8f80] focus:border-[#6b705c] focus:ring-4 focus:ring-[#dfe4d6] ${props.className ?? ''}`}
    />
  );
}

function EditorSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-12 w-full appearance-none rounded-2xl border border-[#d8ccb8] bg-white px-4 pr-10 text-sm text-[#1d1a17] outline-none transition focus:border-[#6b705c] focus:ring-4 focus:ring-[#dfe4d6] ${props.className ?? ''}`}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7c6b]" />
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  rightSlot,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#e3d7c4] bg-white/85 p-6 shadow-[0_18px_45px_rgba(56,44,34,0.08)]">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="font-['Playfair_Display'] text-2xl text-[#1d1a17]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#73675a]">{description}</p>
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

function SectionTabs({
  activeTab,
  onChange,
}: {
  activeTab: EditorTabId;
  onChange: (tab: EditorTabId) => void;
}) {
  return (
    <div className="rounded-[24px] border border-[#d9ccb7] bg-white/75 p-2 shadow-[0_12px_30px_rgba(56,44,34,0.05)]">
      <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
        {editorTabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-[#1d1a17] text-[#f7f1e8] shadow-[0_10px_24px_rgba(29,26,23,0.18)]'
                  : 'text-[#5f564d] hover:bg-[#f5efe6] hover:text-[#1d1a17]'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left transition ${
        active
          ? 'border-[#6b705c] bg-[#eef1ea] shadow-[0_10px_26px_rgba(107,112,92,0.12)]'
          : 'border-[#e1d6c4] bg-[#fcfaf7] hover:border-[#c7b9a2]'
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-[#1d1a17]">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[#7b6f62]">{description}</p>
      </div>
      <div className={`relative h-7 w-12 rounded-full transition ${active ? 'bg-[#6b705c]' : 'bg-[#d9cfbf]'}`}>
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${active ? 'left-6' : 'left-1'}`}
        />
      </div>
    </button>
  );
}

function BasicInfo({
  form,
  onChange,
}: {
  form: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
}) {
  return (
    <SectionCard
      title="General Info"
      description="Start with the essentials shoppers and merchandisers rely on first."
      rightSlot={<span className="rounded-full bg-[#f3eadb] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#6b705c]">Core</span>}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <EditorField label="Product Name">
            <EditorInput
              value={form.name}
              onChange={(event) => onChange({ name: event.target.value, slug: form.slug || slugify(event.target.value) })}
              placeholder="Savile Midnight Suit"
              required
            />
          </EditorField>
        </div>

        <EditorField label="Brand">
          <EditorInput
            value={form.brand}
            onChange={(event) => onChange({ brand: event.target.value })}
            placeholder="Imperial Dilan"
          />
        </EditorField>

        <EditorField label="Category">
          <EditorSelect value={form.category} onChange={(event) => onChange({ category: event.target.value })}>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </EditorSelect>
        </EditorField>

        <EditorField label="Subcategory">
          <EditorSelect
            value={form.subcategory ?? ''}
            onChange={(event) =>
              onChange({ subcategory: event.target.value ? (event.target.value as ProductSubcategory) : undefined })
            }
          >
            <option value="">Optional</option>
            {subcategoryOptions.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </EditorSelect>
        </EditorField>

        <EditorField label="Currency">
          <EditorInput
            value={form.currency}
            onChange={(event) => onChange({ currency: event.target.value.toUpperCase() })}
            maxLength={3}
            placeholder="USD"
          />
        </EditorField>

        <div className="lg:col-span-2">
          <EditorField label="Description">
            <EditorTextarea
              value={form.description}
              onChange={(event) => onChange({ description: event.target.value })}
              placeholder="Describe the tailoring, fabric, fit, and styling angle of the product."
            />
          </EditorField>
        </div>
      </div>
    </SectionCard>
  );
}

function MediaUpload({
  images,
  mainImageIndex,
  onImagesChange,
  onMainImageChange,
}: {
  images: string[];
  mainImageIndex: number;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (index: number) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (!fileList.length) return;

    const uploaded = await Promise.all(fileList.map((file) => readFileAsDataUrl(file)));
    onImagesChange([...images, ...uploaded]);
  };

  return (
    <SectionCard
      title="Media"
      description="Use a clean image set to present the product with luxury-brand confidence."
      rightSlot={
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#d7cab6] bg-[#f6efe4] px-4 py-3 text-sm font-medium text-[#1d1a17] transition hover:border-[#6b705c] hover:bg-[#eef1ea]"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Images
        </button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          void handleFiles(event.target.files ?? []);
          event.target.value = '';
        }}
      />
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-[26px] border-2 border-dashed px-6 py-12 text-center transition ${
          dragActive ? 'border-[#6b705c] bg-[#eef1ea]' : 'border-[#d9ccb7] bg-[#faf6ef]'
        }`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_12px_30px_rgba(56,44,34,0.08)]">
          <ImagePlus className="h-7 w-7 text-[#6b705c]" />
        </div>
        <h4 className="mt-5 font-['Playfair_Display'] text-2xl text-[#1d1a17]">Drag and drop product images</h4>
        <p className="mt-2 text-sm text-[#7b6f62]">PNG, JPG, or WEBP. Upload multiple images and choose one as the main image.</p>
      </div>

      {images.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => {
            const active = index === mainImageIndex;

            return (
              <div
                key={`${image}-${index}`}
                className={`overflow-hidden rounded-[24px] border bg-[#fcfaf7] shadow-[0_14px_32px_rgba(56,44,34,0.06)] transition ${
                  active ? 'border-[#6b705c]' : 'border-[#e1d6c4]'
                }`}
              >
                <div className="relative">
                  <img src={image} alt={`Product ${index + 1}`} className="h-44 w-full object-cover" />
                  {active ? (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#1d1a17] px-3 py-1 text-xs font-medium text-[#f7f1e8]">
                      <Check className="h-3.5 w-3.5" />
                      Main Image
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => onMainImageChange(index)}
                    className={`flex-1 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                      active ? 'bg-[#eef1ea] text-[#4a5b47]' : 'bg-[#f5efe6] text-[#1d1a17] hover:bg-[#ece4d8]'
                    }`}
                  >
                    {active ? 'Selected' : 'Set as Main'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextImages = images.filter((_, imageIndex) => imageIndex !== index);
                      onImagesChange(nextImages);
                      onMainImageChange(nextImages.length === 0 ? 0 : Math.min(mainImageIndex, nextImages.length - 1));
                    }}
                    className="rounded-2xl border border-[#e1d6c4] p-2.5 text-[#7b6f62] transition hover:border-[#b89475] hover:text-[#7b3d24]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </SectionCard>
  );
}

function PricingStock({
  form,
  onChange,
}: {
  form: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
}) {
  return (
    <SectionCard
      title="Pricing & Stock"
      description="Keep commercial information clean and consistent across the catalog."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <EditorField label="Price">
          <EditorInput
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => onChange({ price: Number(event.target.value) })}
            placeholder="620"
          />
        </EditorField>

        <EditorField label="Discount Price" hint="Optional">
          <EditorInput
            type="number"
            min="0"
            value={form.discountPrice ?? ''}
            onChange={(event) => onChange({ discountPrice: event.target.value === '' ? null : Number(event.target.value) })}
            placeholder="540"
          />
        </EditorField>

        <EditorField label="Stock Quantity">
          <EditorInput
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(event) => onChange({ stockQuantity: Number(event.target.value) })}
            placeholder="18"
          />
        </EditorField>

        <EditorField label="SKU" hint="Optional">
          <EditorInput
            value={form.sku}
            onChange={(event) => onChange({ sku: event.target.value.toUpperCase() })}
            placeholder="IMP-SUIT-001"
          />
        </EditorField>
      </div>
    </SectionCard>
  );
}

function Variants({
  variants,
  onChange,
}: {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}) {
  const addVariant = () => onChange([...variants, createVariant()]);

  const updateVariant = (id: string, patch: Partial<ProductVariant>) => {
    onChange(variants.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)));
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((variant) => variant.id !== id));
  };

  return (
    <SectionCard
      title="Variants"
      description="Offer size and color combinations with optional price overrides for refined inventory control."
      rightSlot={
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#1d1a17] px-4 py-3 text-sm font-medium text-[#f7f1e8] transition hover:bg-[#34302b]"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </button>
      }
    >
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            className="rounded-[24px] border border-[#e1d6c4] bg-[#fcfaf7] p-4 shadow-[0_12px_28px_rgba(56,44,34,0.05)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#1d1a17]">Variant {index + 1}</p>
                <p className="text-xs text-[#7b6f62]">Size, color, stock, and optional price override.</p>
              </div>
              {variants.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeVariant(variant.id)}
                  className="rounded-2xl border border-[#e1d6c4] p-2.5 text-[#7b6f62] transition hover:border-[#b89475] hover:text-[#7b3d24]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr_1fr_1fr]">
              <EditorField label="Size">
                <EditorSelect value={variant.size} onChange={(event) => updateVariant(variant.id, { size: event.target.value })}>
                  {variantSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </EditorSelect>
              </EditorField>

              <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
                <EditorField label="Color">
                  <EditorInput
                    type="color"
                    value={variant.colorHex}
                    onChange={(event) => updateVariant(variant.id, { colorHex: event.target.value })}
                    className="cursor-pointer px-2"
                  />
                </EditorField>

                <EditorField label="Color Name">
                  <EditorInput
                    value={variant.colorName}
                    onChange={(event) =>
                      updateVariant(variant.id, {
                        colorName: event.target.value,
                        colorHex: variant.colorHex || colorNameToHex(event.target.value),
                      })
                    }
                    placeholder="Midnight Navy"
                  />
                </EditorField>
              </div>

              <EditorField label="Stock">
                <EditorInput
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(event) => updateVariant(variant.id, { stock: Number(event.target.value) })}
                  placeholder="6"
                />
              </EditorField>

              <EditorField label="Price Override" hint="Optional">
                <EditorInput
                  type="number"
                  min="0"
                  value={variant.priceOverride ?? ''}
                  onChange={(event) =>
                    updateVariant(variant.id, {
                      priceOverride: event.target.value === '' ? null : Number(event.target.value),
                    })
                  }
                  placeholder="640"
                />
              </EditorField>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function TagsVisibility({
  form,
  onChange,
}: {
  form: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
}) {
  const hasNewArrival = form.tags.includes('New');
  const hasBestSeller = form.tags.includes('Best Seller');

  const toggleTag = (tag: string) => {
    onChange({
      tags: form.tags.includes(tag) ? form.tags.filter((item) => item !== tag) : [...form.tags, tag],
    });
  };

  return (
    <SectionCard
      title="Tags & Visibility"
      description="Decide how the item should behave in merchandising, homepage moments, and publishing."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ToggleCard
          label="New Arrival"
          description="Highlights the product in launch and freshness-driven lists."
          active={hasNewArrival}
          onToggle={() => toggleTag('New')}
        />
        <ToggleCard
          label="Featured Product"
          description="Promotes the item in premium editorial and landing page placements."
          active={form.featured}
          onToggle={() => onChange({ featured: !form.featured })}
        />
        <ToggleCard
          label="Best Seller"
          description="Marks the product as a proven high-performer."
          active={hasBestSeller}
          onToggle={() => toggleTag('Best Seller')}
        />
        <ToggleCard
          label="Visible on Website"
          description="Keeps the product live in the storefront catalog."
          active={form.visible}
          onToggle={() => onChange({ visible: !form.visible })}
        />
        <ToggleCard
          label="Show on Homepage"
          description="Allows the item to appear in front-page merchandising."
          active={form.showOnHomepage}
          onToggle={() => onChange({ showOnHomepage: !form.showOnHomepage })}
        />
        <div className="rounded-[22px] border border-[#e1d6c4] bg-[#fcfaf7] p-4">
          <EditorField label="Status">
            <EditorSelect value={form.status} onChange={(event) => onChange({ status: event.target.value as ProductStatus })}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </EditorSelect>
          </EditorField>
        </div>
      </div>
    </SectionCard>
  );
}

function SeoSection({
  form,
  onChange,
}: {
  form: ProductDraft;
  onChange: (patch: Partial<ProductDraft>) => void;
}) {
  const [open, setOpen] = useState(Boolean(form.slug || form.metaTitle || form.metaDescription));

  return (
    <SectionCard
      title="SEO"
      description="Optional metadata for clean URLs, search engine snippets, and polished indexability."
      rightSlot={
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#d7cab6] bg-[#f6efe4] px-4 py-3 text-sm font-medium text-[#1d1a17] transition hover:border-[#6b705c] hover:bg-[#eef1ea]"
        >
          {open ? 'Hide SEO' : 'Show SEO'}
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      }
    >
      {open ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <EditorField label="URL Slug">
            <EditorInput
              value={form.slug ?? ''}
              onChange={(event) => onChange({ slug: slugify(event.target.value) })}
              placeholder="savile-midnight-suit"
            />
          </EditorField>

          <EditorField label="Meta Title">
            <EditorInput
              value={form.metaTitle ?? ''}
              onChange={(event) => onChange({ metaTitle: event.target.value })}
              placeholder="Savile Midnight Suit | Imperial Dilan"
            />
          </EditorField>

          <div className="lg:col-span-2">
            <EditorField label="Meta Description">
              <EditorTextarea
                value={form.metaDescription ?? ''}
                onChange={(event) => onChange({ metaDescription: event.target.value })}
                placeholder="Premium wool tailoring in a sharp midnight silhouette designed for formal evenings."
                className="min-h-[120px]"
              />
            </EditorField>
          </div>
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#d9ccb7] bg-[#faf6ef] px-5 py-6 text-sm text-[#7b6f62]">
          Keep SEO hidden if the team does not need custom metadata for this product yet.
        </div>
      )}
    </SectionCard>
  );
}

export function ProductEditorForm({ initial, defaults, onCancel, onSubmit }: ProductEditorFormProps) {
  const [activeTab, setActiveTab] = useState<EditorTabId>('general');
  const [form, setForm] = useState<ProductDraft>(() => buildDraft(initial, defaults));

  const totalVariantStock = useMemo(
    () => form.variants?.reduce((sum, variant) => sum + Math.max(variant.stock, 0), 0) ?? 0,
    [form.variants],
  );

  const updateForm = (patch: Partial<ProductDraft>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const content = {
    general: <BasicInfo form={form} onChange={updateForm} />,
    media: (
      <MediaUpload
        images={form.images}
        mainImageIndex={form.mainImageIndex}
        onImagesChange={(images) => updateForm({ images })}
        onMainImageChange={(mainImageIndex) => updateForm({ mainImageIndex })}
      />
    ),
    pricing: <PricingStock form={form} onChange={updateForm} />,
    variants: <Variants variants={form.variants ?? [createVariant()]} onChange={(variants) => updateForm({ variants })} />,
    visibility: <TagsVisibility form={form} onChange={updateForm} />,
    seo: <SeoSection form={form} onChange={updateForm} />,
  } satisfies Record<EditorTabId, React.ReactNode>;

  const handleSubmit = (statusOverride?: ProductStatus) => {
    const variants = (form.variants ?? []).filter((variant) => variant.size.trim() && variant.colorName.trim());
    const variantSizes = [...new Set(variants.map((variant) => variant.size))];
    const variantColors = [...new Set(variants.map((variant) => variant.colorName))];
    const tags = new Set(form.tags);

    if (form.featured) {
      tags.add('Featured');
    } else {
      tags.delete('Featured');
    }

    if (form.discountPrice !== null && form.discountPrice < form.price) {
      tags.add('Sale');
    } else {
      tags.delete('Sale');
    }

    const stockQuantity = variants.length > 0 ? totalVariantStock : form.stockQuantity;
    const images = form.images.length > 0 ? form.images : [defaultImageUrl];

    onSubmit({
      ...form,
      productType: deriveProductType(form.category),
      status: statusOverride ?? form.status,
      availability: stockQuantity > 0 ? 'In Stock' : 'Out of Stock',
      stockQuantity,
      sizes: variantSizes.length > 0 ? variantSizes : form.sizes.length > 0 ? form.sizes : ['One Size'],
      colors: variantColors.length > 0 ? variantColors : form.colors.length > 0 ? form.colors : ['Signature Olive'],
      variants,
      tags: [...tags],
      slug: form.slug ? slugify(form.slug) : slugify(form.name),
      metaTitle: form.metaTitle?.trim() || form.name,
      metaDescription: form.metaDescription?.trim() || form.description,
      images,
      mainImageIndex: Math.min(form.mainImageIndex, images.length - 1),
    });
  };

  return (
    <div className="space-y-6 rounded-[32px] bg-[linear-gradient(180deg,#f7f1e8_0%,#efe5d7_100%)] p-5 text-[#1d1a17] sm:p-6">
      <div className="overflow-hidden rounded-[30px] border border-[#dfd3c0] bg-[radial-gradient(circle_at_top_left,#fdfaf5_0%,#f3eadb_50%,#ece2d3_100%)] p-6 shadow-[0_20px_50px_rgba(56,44,34,0.08)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6b705c]">Product Studio</p>
            <h2 className="mt-3 font-['Playfair_Display'] text-4xl text-[#1d1a17] sm:text-5xl">Premium product editor</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6458]">
              A modern catalog workflow for fashion merchandising, image curation, pricing control, and product visibility.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[#e0d4c2] bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8b7e70]">Status</p>
              <p className="mt-2 text-lg font-semibold text-[#1d1a17]">{form.status}</p>
            </div>
            <div className="rounded-[24px] border border-[#e0d4c2] bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8b7e70]">Images</p>
              <p className="mt-2 text-lg font-semibold text-[#1d1a17]">{form.images.length}</p>
            </div>
            <div className="rounded-[24px] border border-[#e0d4c2] bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8b7e70]">Variant Stock</p>
              <p className="mt-2 text-lg font-semibold text-[#1d1a17]">{totalVariantStock}</p>
            </div>
          </div>
        </div>
      </div>

      <SectionTabs activeTab={activeTab} onChange={setActiveTab} />

      {content[activeTab]}

      <div className="flex flex-col gap-3 rounded-[28px] border border-[#ddd1bf] bg-white/80 p-4 shadow-[0_16px_40px_rgba(56,44,34,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-[#74685c]">
          <Eye className="h-4 w-4 text-[#6b705c]" />
          <span>The editor uses local state only. No backend connection is required.</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d8ccb8] bg-[#f6efe4] px-5 py-3 text-sm font-medium text-[#1d1a17] transition hover:border-[#c1b29b] hover:bg-[#eee4d6]"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d8ccb8] bg-white px-5 py-3 text-sm font-medium text-[#1d1a17] transition hover:border-[#6b705c] hover:bg-[#eef1ea]"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1d1a17] px-5 py-3 text-sm font-semibold text-[#f7f1e8] shadow-[0_12px_28px_rgba(29,26,23,0.18)] transition hover:bg-[#34302b]"
          >
            <Check className="h-4 w-4" />
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
