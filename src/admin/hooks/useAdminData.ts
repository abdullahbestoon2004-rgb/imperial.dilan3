import { useMemo, useState } from 'react';
import { initialAdminData } from '../mock-data/adminData';
import type {
  Category,
  Collection,
  Discount,
  MediaItem,
  Message,
  Order,
  Product,
  RevenuePoint,
  StoreSettings,
  WebsiteContent,
} from '../types';

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAdminData() {
  const [products, setProducts] = useState(initialAdminData.products);
  const [categories, setCategories] = useState(initialAdminData.categories);
  const [collections, setCollections] = useState(initialAdminData.collections);
  const [orders, setOrders] = useState(initialAdminData.orders);
  const [customers] = useState(initialAdminData.customers);
  const [messages, setMessages] = useState(initialAdminData.messages);
  const [websiteContent, setWebsiteContent] = useState(initialAdminData.websiteContent);
  const [mediaLibrary, setMediaLibrary] = useState(initialAdminData.mediaLibrary);
  const [discounts, setDiscounts] = useState(initialAdminData.discounts);
  const [settings, setSettings] = useState(initialAdminData.settings);
  const [notifications, setNotifications] = useState(initialAdminData.notifications);
  const [baseRevenueSeries] = useState(initialAdminData.revenueSeries);
  const [trafficSources] = useState(initialAdminData.trafficSources);

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const newCustomers = customers.filter((customer) => {
      const joinedDate = new Date(customer.joinedAt);
      const threshold = new Date('2026-02-10T00:00:00Z');
      return joinedDate >= threshold;
    }).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      revenue: totalRevenue,
      newCustomers,
      publishedProducts: products.filter((product) => product.status === 'Published').length,
      featuredProducts: products.filter((product) => product.featured).length,
      unreadMessages: messages.filter((message) => !message.read).length,
      hiddenProducts: products.filter((product) => !product.visible).length,
      lowStockProducts: products.filter((product) => product.stockQuantity <= 10).length,
      activeDiscounts: discounts.filter((discount) => discount.active).length,
    };
  }, [customers, discounts, messages, orders, products]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6),
    [orders],
  );

  const recentMessages = useMemo(
    () => [...messages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6),
    [messages],
  );

  const salesSeries = useMemo<RevenuePoint[]>(() => {
    const currentMonthRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const currentMonthOrders = orders.length;

    return baseRevenueSeries.map((point) =>
      point.label === 'Mar' ? { ...point, revenue: currentMonthRevenue, orders: currentMonthOrders } : point,
    );
  }, [baseRevenueSeries, orders]);

  const addProduct = (payload: Omit<Product, 'id' | 'updatedAt'>) => {
    setProducts((prev) => [{ ...payload, id: createId('prd'), updatedAt: new Date().toISOString() }, ...prev]);
  };

  const updateProduct = (id: string, payload: Omit<Product, 'id' | 'updatedAt'>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...payload, id, updatedAt: new Date().toISOString() } : item)),
    );
  };

  const deleteProduct = (id: string) => setProducts((prev) => prev.filter((item) => item.id !== id));

  const toggleProductVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible, updatedAt: new Date().toISOString() } : item,
      ),
    );
  };

  const toggleProductFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured, updatedAt: new Date().toISOString() } : item,
      ),
    );
  };

  const addCategory = (payload: Omit<Category, 'id'>) => {
    setCategories((prev) => [...prev, { ...payload, id: createId('cat') }]);
  };

  const updateCategory = (id: string, payload: Omit<Category, 'id'>) => {
    setCategories((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
  };

  const deleteCategory = (id: string) => setCategories((prev) => prev.filter((item) => item.id !== id));

  const addCollection = (payload: Omit<Collection, 'id'>) => {
    setCollections((prev) => [{ ...payload, id: createId('col') }, ...prev]);
  };

  const updateCollection = (id: string, payload: Omit<Collection, 'id'>) => {
    setCollections((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
  };

  const deleteCollection = (id: string) => setCollections((prev) => prev.filter((item) => item.id !== id));

  const updateOrderStatus = (id: string, orderStatus: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, orderStatus, timeline: [...item.timeline, `Status updated to ${orderStatus}`] }
          : item,
      ),
    );
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const deleteMessage = (id: string) => setMessages((prev) => prev.filter((item) => item.id !== id));

  const updateWebsiteContent = (payload: WebsiteContent) => setWebsiteContent(payload);

  const addMediaItem = (payload: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    setMediaLibrary((prev) => [
      { ...payload, id: createId('med'), uploadedAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const deleteMediaItem = (id: string) => setMediaLibrary((prev) => prev.filter((item) => item.id !== id));

  const addDiscount = (payload: Omit<Discount, 'id'>) => {
    setDiscounts((prev) => [{ ...payload, id: createId('dis') }, ...prev]);
  };

  const updateDiscount = (id: string, payload: Omit<Discount, 'id'>) => {
    setDiscounts((prev) => prev.map((item) => (item.id === id ? { ...payload, id } : item)));
  };

  const deleteDiscount = (id: string) => setDiscounts((prev) => prev.filter((item) => item.id !== id));

  const updateSettings = (payload: StoreSettings) => setSettings(payload);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return {
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
    actions: {
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductVisibility,
      toggleProductFeatured,
      addCategory,
      updateCategory,
      deleteCategory,
      addCollection,
      updateCollection,
      deleteCollection,
      updateOrderStatus,
      markMessageRead,
      deleteMessage,
      updateWebsiteContent,
      addMediaItem,
      deleteMediaItem,
      addDiscount,
      updateDiscount,
      deleteDiscount,
      updateSettings,
      markNotificationRead,
    },
  };
}
