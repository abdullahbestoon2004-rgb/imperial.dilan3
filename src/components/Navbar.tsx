import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ChevronDown, Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { CONTACT_SECTION_ID, scrollToContact } from '../utils/scrollToContact';

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  {
    label: 'Clothing',
    href: '/suits',
    children: [
      { label: 'Suits', href: '/suits?category=suits' },
      { label: 'Jackets', href: '/suits?category=jackets' },
      { label: 'Coats', href: '/suits?category=coats' },
      { label: 'Shirts', href: '/suits?category=shirts' },
      { label: 'Trousers', href: '/suits?category=trousers' },
      { label: 'Waistcoats', href: '/suits?category=waistcoats' },
      { label: 'Knitwear', href: '/suits?category=knitwear' },
      { label: 'Casual', href: '/suits?category=casual' },
    ],
  },
  {
    label: 'Shoes',
    href: '/shoes',
    children: [
      { label: 'Formal Shoes', href: '/shoes?category=dress' },
      { label: 'Sneakers', href: '/shoes?category=sneakers' },
      { label: 'Loafers', href: '/shoes?category=loafers' },
      { label: 'Boots', href: '/shoes?category=boots' },
      { label: 'Sandals', href: '/shoes?category=sandals' },
    ],
  },
  {
    label: 'Accessories',
    href: '/accessories',
    children: [
      { label: 'Belts', href: '/accessories?category=belts' },
      { label: 'Watches', href: '/accessories?category=watches' },
      { label: 'Sunglasses', href: '/accessories?category=sunglasses' },
      { label: 'Bags', href: '/accessories?category=bags' },
      { label: 'Wallets', href: '/accessories?category=wallets' },
      { label: 'Ties', href: '/accessories?category=ties' },
    ],
  },
  {
    label: 'Collections',
    href: '#',
    children: [
      { label: 'Business / Formal', href: '#' },
      { label: 'Smart Casual', href: '#' },
      { label: 'Streetwear', href: '#' },
      { label: 'Summer Collection', href: '#' },
      { label: 'Winter Collection', href: '#' },
      { label: 'Limited Edition', href: '#' },
    ],
  },
  { label: 'Sale', href: '#' },
  { label: 'Contact', href: `#${CONTACT_SECTION_ID}` },
];

function isInternalLink(href: string) {
  return href.startsWith('/');
}

function NavAnchor({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
}) {
  if (item.href === `#${CONTACT_SECTION_ID}`) {
    return (
      <a
        href={item.href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          onClick?.();
          scrollToContact();
        }}
      >
        {item.label}
      </a>
    );
  }

  if (isInternalLink(item.href)) {
    return (
      <Link to={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className} onClick={onClick}>
      {item.label}
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});
  const closeTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const { wishlistCount } = useWishlist();
  const { cartItems, cartCount, cartSubtotal, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart();
  const wishlistCountLabel = wishlistCount > 99 ? '99+' : String(wishlistCount);
  const cartCountLabel = cartCount > 99 ? '99+' : String(cartCount);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || loginOpen || cartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, loginOpen, cartOpen]);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDropdown = (label: string) => {
    clearCloseTimer();
    setActiveDropdown(label);
  };

  const toggleDesktopDropdown = (label: string) => {
    clearCloseTimer();
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  const scheduleDropdownClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 320);
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setLoginOpen(false);
        setCartOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleMobileSection = (key: string) => {
    setExpandedMobile((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMobileItems = (items: NavItem[], depth = 0, parent = ''): JSX.Element[] => {
    return items.map((item) => {
      const key = parent ? `${parent}>${item.label}` : item.label;
      const hasChildren = Boolean(item.children?.length);
      const hasDirectLink = isInternalLink(item.href);
      const isExpanded = Boolean(expandedMobile[key]);
      const depthPadding = depth === 0 ? '' : depth === 1 ? 'pl-4' : 'pl-8';

      if (!hasChildren) {
        return (
          <NavAnchor
            key={key}
            item={item}
            onClick={() => setMobileOpen(false)}
            className={`block rounded-md px-2 py-2 font-['Inter'] text-[#E7D7C4] transition-colors hover:bg-[#3A2418]/35 hover:text-[#D6A25B] ${depthPadding} ${
              depth === 0 ? 'text-sm' : 'text-[13px]'
            }`}
          />
        );
      }

      return (
        <div key={key} className="space-y-1">
          {hasDirectLink ? (
            <div
              className={`flex items-center justify-between rounded-md px-2 py-2 font-['Inter'] text-[#E7D7C4] transition-colors hover:bg-[#3A2418]/35 hover:text-[#D6A25B] ${depthPadding} ${
                depth === 0 ? 'text-sm' : 'text-[13px]'
              }`}
            >
              <NavAnchor item={item} onClick={() => setMobileOpen(false)} className="flex-1 text-left" />
              <button
                type="button"
                className="ml-3"
                onClick={() => toggleMobileSection(key)}
                aria-expanded={isExpanded}
                aria-label={`Toggle ${item.label} menu`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left font-['Inter'] text-[#E7D7C4] transition-colors hover:bg-[#3A2418]/35 hover:text-[#D6A25B] ${depthPadding} ${
                depth === 0 ? 'text-sm' : 'text-[13px]'
              }`}
              onClick={() => toggleMobileSection(key)}
              aria-expanded={isExpanded}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
          )}

          <div
            className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden border-l border-[#6E6A66]/35">
              <div className="space-y-1 py-1">{renderMobileItems(item.children ?? [], depth + 1, key)}</div>
            </div>
          </div>
        </div>
      );
    });
  };

  const loginModal = (
    <div
      className={`fixed inset-0 z-[120] grid place-items-center bg-[#1B1411]/55 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        loginOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={() => setLoginOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[26px] border border-[#D7C8B3] bg-[#EFEDEC] p-8 shadow-[0_28px_70px_rgba(27,20,17,0.35)]"
      >
        <button
          type="button"
          onClick={() => setLoginOpen(false)}
          className="ml-auto flex rounded-full p-1 text-[#6E5A49] transition hover:text-[#3A2418]"
          aria-label="Close login"
        >
          <X size={20} />
        </button>

        <div className="mt-1 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-[#8D735A]">Imperial Account</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-5xl leading-[1.02] text-[#3A2418] sm:text-6xl">Login</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6E5A49] sm:text-base">
            Sign in to view orders, saved items, and your profile.
          </p>
        </div>

        <form
          className="mt-7 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#6E5A49]">Email</span>
            <input
              type="email"
              defaultValue="admin"
              className="h-[46px] w-full rounded-2xl border border-[#D3BFAB] bg-[#D9DDE9] px-4 text-base text-[#2D241E] outline-none transition focus:border-[#B68B63]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#6E5A49]">Password</span>
            <input
              type="password"
              defaultValue="1234567"
              className="h-[46px] w-full rounded-2xl border border-[#D3BFAB] bg-[#D9DDE9] px-4 text-base text-[#2D241E] outline-none transition focus:border-[#B68B63]"
            />
          </label>

          <button
            type="submit"
            className="mt-1 h-[44px] w-full rounded-[15px] bg-[#3A2418] text-lg font-semibold text-[#F6F0E8] transition hover:bg-[#4A2F20]"
          >
            Login
          </button>
        </form>

        <div className="mt-8 border-t border-[#D7C8B3] pt-6 text-center">
          <p className="text-base text-[#6E5A49]">Need access to store management?</p>
          <Link
            to="/admin"
            onClick={() => setLoginOpen(false)}
            className="mt-5 inline-flex h-[44px] w-full items-center justify-center rounded-[15px] border border-[#8E94A2] bg-[#737A8A] text-lg font-semibold text-white transition hover:bg-[#656D80]"
          >
            Open Admin Page
          </Link>
        </div>
      </div>
    </div>
  );

  const cartDrawer = (
    <div
      className={`fixed inset-0 z-[130] transition-opacity duration-200 ${
        cartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!cartOpen}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1B1411]/55 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
        aria-label="Close cart drawer"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[420px] border-l border-[#6E6A66]/35 bg-[#F1EBE2] shadow-[-10px_0_35px_rgba(0,0,0,0.2)]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#6E6A66]/25 px-5 py-4">
            <div>
              <p className="font-['Inter'] text-xs tracking-[0.2em] text-[#6E6A66]">YOUR CART</p>
              <p className="mt-1 font-['Playfair_Display'] text-2xl text-[#2F2F2F]">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="rounded-full border border-[#6E6A66] p-2 text-[#2F2F2F] transition-colors hover:border-[#B67A2D] hover:text-[#B67A2D]"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {cartItems.length === 0 ? (
              <div className="rounded-md border border-[#6E6A66]/25 bg-[#E8E1D8] p-6 text-center">
                <p className="font-['Playfair_Display'] text-2xl text-[#2F2F2F]">Cart is empty</p>
                <p className="mt-2 font-['Inter'] text-sm text-[#6E6A66]">Use the Add to Cart button on products.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <article key={item.cartKey} className="rounded-md border border-[#6E6A66]/25 bg-[#E8E1D8] p-3">
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-20 rounded-sm object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-['Playfair_Display'] text-lg leading-tight text-[#2F2F2F]">{item.name}</p>
                        <p className="mt-1 font-['Inter'] text-sm text-[#6E6A66]">{item.brand ?? 'Polo Ralph Lauren'}</p>
                        <p className="mt-2 font-['Inter'] text-sm text-[#2F2F2F]">${item.price.toFixed(2)}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[#6E6A66]/40">
                            <button
                              type="button"
                              onClick={() => decrementQuantity(item.cartKey)}
                              className="px-3 py-1.5 font-['Inter'] text-[#2F2F2F] transition-colors hover:text-[#B67A2D]"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center font-['Inter'] text-sm text-[#2F2F2F]">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => incrementQuantity(item.cartKey)}
                              className="px-3 py-1.5 font-['Inter'] text-[#2F2F2F] transition-colors hover:text-[#B67A2D]"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartKey)}
                            className="font-['Inter'] text-xs tracking-[0.12em] text-[#6E6A66] transition-colors hover:text-[#B67A2D]"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#6E6A66]/25 px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-['Inter'] text-sm text-[#6E6A66]">Subtotal</span>
              <span className="font-['Playfair_Display'] text-2xl text-[#2F2F2F]">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="h-11 flex-1 rounded-full border border-[#6E6A66] font-['Inter'] text-xs tracking-[0.14em] text-[#2F2F2F] transition-colors hover:border-[#B67A2D] hover:text-[#B67A2D]"
              >
                CLEAR CART
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="h-11 flex-1 rounded-full bg-[#3A2418] font-['Inter'] text-xs tracking-[0.14em] text-[#E7D7C4] transition-colors hover:bg-[#4A2F20]"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <nav
      ref={navRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#1B1411]/78 shadow-[0_12px_35px_rgba(15,7,1,0.35)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1700px] px-4 md:px-6">
        <div className="flex h-[78px] items-center md:h-[84px]">
          <div className="w-[180px] shrink-0">
            <Link to="/" className="inline-flex items-center" aria-label="Imperial home">
              <img src="/imperial-logo.png" alt="Imperial logo" className="h-12 w-auto object-contain md:h-14" />
            </Link>
          </div>

          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-5 xl:gap-6">
              {NAV_ITEMS.map((item) => {
                const hasDropdown = Boolean(item.children?.length);
                const hasDirectLink = isInternalLink(item.href);
                const isOpen = activeDropdown === item.label;
                const isClothingMenu = item.label === 'Clothing';
                const columnsClass =
                  isClothingMenu
                    ? 'md:grid-cols-2'
                    : (item.children?.length ?? 0) > 6
                    ? 'md:grid-cols-3'
                    : (item.children?.length ?? 0) > 3
                      ? 'md:grid-cols-2'
                      : 'md:grid-cols-1';

                if (!hasDropdown) {
                  return (
                    <NavAnchor
                      key={item.label}
                      item={item}
                      className="font-['Inter'] text-[11px] tracking-wide text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
                    />
                  );
                }

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => openDropdown(item.label)}
                    onMouseLeave={scheduleDropdownClose}
                  >
                    {hasDirectLink ? (
                      <div className="flex items-center gap-1" onFocusCapture={() => openDropdown(item.label)}>
                        <NavAnchor
                          item={item}
                          className={`font-['Inter'] text-[11px] tracking-wide transition-colors ${
                            isOpen ? 'text-[#D6A25B]' : 'text-[#E7D7C4] hover:text-[#D6A25B]'
                          }`}
                        />
                        <button
                          type="button"
                          className={`flex items-center transition-colors ${
                            isOpen ? 'text-[#D6A25B]' : 'text-[#E7D7C4] hover:text-[#D6A25B]'
                          }`}
                          onClick={() => toggleDesktopDropdown(item.label)}
                          onFocus={() => openDropdown(item.label)}
                          aria-haspopup="menu"
                          aria-expanded={isOpen}
                          aria-label={`Toggle ${item.label} menu`}
                        >
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-1 font-['Inter'] text-[11px] tracking-wide text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
                        onClick={() => toggleDesktopDropdown(item.label)}
                        onFocus={() => openDropdown(item.label)}
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </button>
                    )}

                    <div
                      onMouseEnter={() => openDropdown(item.label)}
                      onMouseLeave={scheduleDropdownClose}
                      className={`absolute left-1/2 top-full z-50 mt-0 w-[min(88vw,900px)] -translate-x-1/2 pt-2 transition-all duration-200 ${
                        isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
                      }`}
                    >
                      <div className="rounded-2xl border border-[#6E6A66]/35 bg-[#3A2418] p-6 shadow-[0_20px_55px_rgba(15,7,1,0.35)]">
                        {isClothingMenu ? (
                          <div>
                            <p className="font-['Inter'] text-[11px] uppercase tracking-[0.28em] text-[#E7D7C4]">Clothing</p>
                            <div className="mt-3 border-t border-[#6E6A66]/45 pt-5">
                              <div className={`grid grid-cols-1 gap-x-20 gap-y-5 ${columnsClass}`}>
                                {item.children?.map((entry) => (
                                  <NavAnchor
                                    key={entry.label}
                                    item={entry}
                                    className="block font-['Inter'] text-[15px] leading-none text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={`grid grid-cols-1 gap-x-10 gap-y-6 ${columnsClass}`}>
                            {item.children?.map((group) => (
                              <div key={group.label} className="space-y-2">
                                <NavAnchor
                                  item={group}
                                  className="block font-['Playfair_Display'] text-[18px] text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
                                />

                                {group.children?.length ? (
                                  <div className="space-y-1 border-l border-[#6E6A66]/35 pl-3">
                                    {group.children.map((child) => (
                                      <NavAnchor
                                        key={child.label}
                                        item={child}
                                        className="block font-['Inter'] text-sm text-[#E7D7C4]/80 transition-colors hover:text-[#D6A25B]"
                                      />
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden w-[180px] shrink-0 justify-end gap-4 lg:flex">
            <button className="text-[#E7D7C4] transition-colors hover:text-[#D6A25B]" aria-label="Search">
              <Search size={19} />
            </button>
            <button
              type="button"
              className="text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label="Account"
              onClick={() => setLoginOpen(true)}
            >
              <User size={19} />
            </button>
            <Link
              to="/heart-list"
              className="relative text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label="Open heart list"
            >
              <Heart size={19} />
              {wishlistCount > 0 ? (
                <span className="absolute -right-2.5 -top-2.5 flex min-w-5 items-center justify-center rounded-full bg-[#D6A25B] px-1.5 py-0.5 text-[10px] font-['Inter'] text-[#1B1411]">
                  {wishlistCountLabel}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="relative text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label="Open cart drawer"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={19} />
              {cartCount > 0 ? (
                <span className="absolute -right-2.5 -top-2.5 flex min-w-5 items-center justify-center rounded-full bg-[#D6A25B] px-1.5 py-0.5 text-[10px] font-['Inter'] text-[#1B1411]">
                  {cartCountLabel}
                </span>
              ) : null}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3 lg:hidden">
            <button className="text-[#E7D7C4] transition-colors hover:text-[#D6A25B]" aria-label="Search">
              <Search size={20} />
            </button>
            <button
              type="button"
              className="text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label="Account"
              onClick={() => {
                setMobileOpen(false);
                setLoginOpen(true);
              }}
            >
              <User size={20} />
            </button>
            <Link
              to="/heart-list"
              onClick={() => setMobileOpen(false)}
              className="relative text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label="Open heart list"
            >
              <Heart size={20} />
              {wishlistCount > 0 ? (
                <span className="absolute -right-2.5 -top-2.5 flex min-w-5 items-center justify-center rounded-full bg-[#D6A25B] px-1.5 py-0.5 text-[10px] font-['Inter'] text-[#1B1411]">
                  {wishlistCountLabel}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="relative text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label="Open cart drawer"
              onClick={() => {
                setMobileOpen(false);
                setCartOpen(true);
              }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 ? (
                <span className="absolute -right-2.5 -top-2.5 flex min-w-5 items-center justify-center rounded-full bg-[#D6A25B] px-1.5 py-0.5 text-[10px] font-['Inter'] text-[#1B1411]">
                  {cartCountLabel}
                </span>
              ) : null}
            </button>
            <button
              className="text-[#E7D7C4] transition-colors hover:text-[#D6A25B]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-[#6E6A66]/35 bg-[#3A2418]">
          <div className="mx-auto max-w-[1700px] space-y-2 px-4 py-4 md:px-6">{renderMobileItems(NAV_ITEMS)}</div>
        </div>
      </div>

      </nav>
      {typeof document !== 'undefined' ? createPortal(loginModal, document.body) : null}
      {typeof document !== 'undefined' ? createPortal(cartDrawer, document.body) : null}
    </>
  );
}
