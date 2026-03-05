'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/components/RecentlyViewedProvider';
import type { Product } from '@/components/ProductCard';

export default function TrackRecentlyViewed({ product }: { product: Product }) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product.goodsNo]);

  return null;
}
