import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CART_STORAGE_KEY = 'imperial:cart';

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  imageHover: string;
  brand?: string;
  color?: string;
  colors?: string[];
}

export interface CartItem extends CartProduct {
  cartKey: string;
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (cartKey: string) => void;
  decrementQuantity: (cartKey: string) => void;
  incrementQuantity: (cartKey: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function buildCartKey(product: Pick<CartProduct, 'id' | 'name'>) {
  const normalizedName = product.name.trim().toLowerCase().replace(/\s+/g, '-');
  return `${product.id}-${normalizedName}`;
}

function normalizeCartItem(input: unknown): CartItem | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const value = input as Record<string, unknown>;
  if (
    typeof value.id !== 'number' ||
    typeof value.name !== 'string' ||
    typeof value.price !== 'number' ||
    typeof value.image !== 'string' ||
    typeof value.quantity !== 'number'
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
    quantity: Math.max(1, Math.floor(value.quantity)),
    cartKey:
      typeof value.cartKey === 'string'
        ? value.cartKey
        : buildCartKey({ id: value.id, name: value.name }),
  };
}

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => normalizeCartItem(entry))
      .filter((entry): entry is CartItem => entry !== null);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readStoredCart());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (product: CartProduct) => {
      const cartKey = buildCartKey(product);

      setCartItems((previousItems) => {
        const existingItem = previousItems.find((item) => item.cartKey === cartKey);
        if (!existingItem) {
          return [
            ...previousItems,
            {
              ...product,
              cartKey,
              quantity: 1,
            },
          ];
        }

        return previousItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
        );
      });
    };

    const removeFromCart = (cartKey: string) => {
      setCartItems((previousItems) => previousItems.filter((item) => item.cartKey !== cartKey));
    };

    const decrementQuantity = (cartKey: string) => {
      setCartItems((previousItems) =>
        previousItems
          .map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    };

    const incrementQuantity = (cartKey: string) => {
      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    };

    const clearCart = () => {
      setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      cartItems,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      decrementQuantity,
      incrementQuantity,
      clearCart,
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
