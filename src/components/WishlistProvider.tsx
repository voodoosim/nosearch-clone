'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Product } from './ProductCard';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (goodsNo: string) => void;
  isWishlisted: (goodsNo: string) => boolean;
  toggle: (product: Product) => void;
  totalCount: number;
}

const STORAGE_KEY = 'smartdeal-wishlist';

const WishlistContext = createContext<WishlistContextType | null>(null);

function loadWishlist(): Product[] {
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

function saveWishlist(items: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadWishlist());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveWishlist(items);
  }, [items, mounted]);

  const addToWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      const key = product.goodsNo || product.id;
      if (prev.some((p) => (p.goodsNo || p.id) === key)) return prev;
      return [product, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((goodsNo: string) => {
    setItems((prev) => prev.filter((p) => (p.goodsNo || p.id) !== goodsNo));
  }, []);

  const isWishlisted = useCallback(
    (goodsNo: string) => items.some((p) => (p.goodsNo || p.id) === goodsNo),
    [items]
  );

  const toggle = useCallback(
    (product: Product) => {
      const key = product.goodsNo || product.id;
      if (isWishlisted(key)) {
        removeFromWishlist(key);
      } else {
        addToWishlist(product);
      }
    },
    [isWishlisted, addToWishlist, removeFromWishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        toggle,
        totalCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
