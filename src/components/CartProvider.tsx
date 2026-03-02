'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
  goodsNo: string;
  goodsNm: string;
  imageUrl: string;
  goodsPrice: number;
  fixedPrice: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (goodsNo: string) => void;
  updateQuantity: (goodsNo: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
}

const STORAGE_KEY = 'smartdeal-cart';

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveCart(items);
    }
  }, [items, mounted]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.goodsNo === item.goodsNo);
      if (existing) {
        return prev.map((i) =>
          i.goodsNo === item.goodsNo
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((goodsNo: string) => {
    setItems((prev) => prev.filter((i) => i.goodsNo !== goodsNo));
  }, []);

  const updateQuantity = useCallback((goodsNo: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.goodsNo === goodsNo ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
