import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const WISHLIST_STORAGE_KEY = 'imperial:wishlist';

export interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  imageHover: string;
  brand?: string;
  color?: string;
  colors?: string[];
}

export interface WishlistItem extends WishlistProduct {
  wishlistKey: string;
}

interface WishlistContextValue {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  isWishlisted: (product: WishlistProduct) => boolean;
  toggleWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (wishlistKey: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function buildWishlistKey(product: Pick<WishlistProduct, 'id' | 'name'>) {
  const normalizedName = product.name.trim().toLowerCase().replace(/\s+/g, '-');
  return `${product.id}-${normalizedName}`;
}

function normalizeWishlistItem(input: unknown): WishlistItem | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const value = input as Record<string, unknown>;
  if (
    typeof value.id !== 'number' ||
    typeof value.name !== 'string' ||
    typeof value.price !== 'number' ||
    typeof value.image !== 'string'
  ) {
    return null;
  }

  const imageHover = typeof value.imageHover === 'string' ? value.imageHover : value.image;
  const brand = typeof value.brand === 'string' ? value.brand : undefined;
  const color = typeof value.color === 'string' ? value.color : undefined;
  const colors = Array.isArray(value.colors)
    ? value.colors.filter((entry): entry is string => typeof entry === 'string')
    : undefined;

  return {
    id: value.id,
    name: value.name,
    price: value.price,
    image: value.image,
    imageHover,
    brand,
    color,
    colors,
    wishlistKey:
      typeof value.wishlistKey === 'string'
        ? value.wishlistKey
        : buildWishlistKey({ id: value.id, name: value.name }),
  };
}

function readStoredWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => normalizeWishlistItem(entry))
      .filter((entry): entry is WishlistItem => entry !== null);
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => readStoredWishlist());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const value = useMemo<WishlistContextValue>(() => {
    const isWishlisted = (product: WishlistProduct) => {
      const wishlistKey = buildWishlistKey(product);
      return wishlistItems.some((item) => item.wishlistKey === wishlistKey);
    };

    const toggleWishlist = (product: WishlistProduct) => {
      const wishlistKey = buildWishlistKey(product);

      setWishlistItems((previousItems) => {
        const alreadyInWishlist = previousItems.some((item) => item.wishlistKey === wishlistKey);
        if (alreadyInWishlist) {
          return previousItems.filter((item) => item.wishlistKey !== wishlistKey);
        }

        return [
          ...previousItems,
          {
            ...product,
            wishlistKey,
          },
        ];
      });
    };

    const removeFromWishlist = (wishlistKey: string) => {
      setWishlistItems((previousItems) => previousItems.filter((item) => item.wishlistKey !== wishlistKey));
    };

    const clearWishlist = () => {
      setWishlistItems([]);
    };

    return {
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    };
  }, [wishlistItems]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
