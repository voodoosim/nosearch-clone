'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Product } from './ProductCard';

const MAX_RECENT = 20;
const STORAGE_KEY = 'smartdeal-recently-viewed';

interface RecentlyViewedContextType {
  items: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearAll: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

function loadItems(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveItems(items: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveItems(items);
  }, [items, mounted]);

  const addRecentlyViewed = useCallback((product: Product) => {
    setItems((prev) => {
      const key = product.goodsNo || product.id;
      const filtered = prev.filter((p) => (p.goodsNo || p.id) !== key);
      return [product, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ items, addRecentlyViewed, clearAll }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
