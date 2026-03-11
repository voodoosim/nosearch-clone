import type { Product } from '@/components/ProductCard';
import createPB from '@/lib/pocketbase';
import bestProducts from '@/data/products-best.json';
import dealProducts from '@/data/products-deal.json';
import timedealProducts from '@/data/products-timedeal.json';
import reviewProducts from '@/data/products-review.json';
import samsungProducts from '@/data/products-samsung.json';
import overseasProducts from '@/data/products-overseas.json';
import smartExtraProducts from '@/data/products-smart-extra.json';
import appleProducts from '@/data/products-apple.json';
import lgProducts from '@/data/products-lg.json';

export interface CategoryInfo {
  key: string;
  label: string;
  icon: string;
  description: string;
  keys: string[];
}

export const RECOMMENDATION_CATEGORIES: CategoryInfo[] = [
  {
    key: 'macbook_pro',
    label: 'MacBook Pro',
    icon: '💻',
    description: 'M5 · M5 Pro · M5 Max 칩 탑재 최고급 프로 노트북',
    keys: ['macbook_pro_14', 'macbook_pro_16'],
  },
  {
    key: 'mac_studio',
    label: 'Mac Studio',
    icon: '🖥️',
    description: 'M4 Max · M3 Ultra 칩 탑재 크리에이터용 데스크탑',
    keys: ['mac_studio'],
  },
  {
    key: 'mac_pro',
    label: 'Mac Pro',
    icon: '⚙️',
    description: '전문가·서버급 최상위 데스크탑 워크스테이션',
    keys: ['mac_pro'],
  },
  {
    key: 'mac_mini',
    label: 'Mac mini',
    icon: '📦',
    description: 'M4 · M4 Pro 칩 탑재 컴팩트 고성능 데스크탑',
    keys: ['mac_mini'],
  },
];

const CATEGORY_KEY_LABELS: Record<string, string> = {
  macbook_pro_14: 'MacBook Pro 14"',
  macbook_pro_16: 'MacBook Pro 16"',
  mac_studio: 'Mac Studio',
  mac_pro: 'Mac Pro',
  mac_mini: 'Mac mini',
};

export function getCategoryKeyLabel(key: string): string {
  return CATEGORY_KEY_LABELS[key] || key;
}

// PocketBase record -> Product 변환
function recordToProduct(record: Record<string, unknown>): Product {
  return {
    id: (record.id as string) || (record.goodsNo as string) || '',
    goodsNo: (record.goodsNo as string) || '',
    goodsNm: (record.goodsNm as string) || '',
    brandName: (record.brandName as string) || '',
    categoryName: (record.categoryName as string) || '',
    goodsPrice: (record.goodsPrice as number) || 0,
    fixedPrice: (record.fixedPrice as number) || 0,
    imageUrl: (record.imageUrl as string) || '',
    pickType: (record.pickType as string) || '',
    soldOutFl: (record.soldOutFl as string) || 'n',
    reviewAvg: (record.reviewAvg as number) || 0,
    reviewCnt: (record.reviewCnt as number) || 0,
    productCategoryKey: (record.productCategoryKey as string) || undefined,
    periodDiscountEnd: (record.periodDiscountEnd as string) || undefined,
    isTimedeal: (record.isTimedeal as boolean) || false,
  };
}

// JSON fallback: 중복 제거된 전체 상품
function getAllProductsFromJson(): Product[] {
  const seen = new Set<string>();
  const all: Product[] = [];
  const sources = [
    bestProducts as Product[],
    dealProducts as Product[],
    timedealProducts as Product[],
    reviewProducts as Product[],
    samsungProducts as Product[],
    overseasProducts as Product[],
    smartExtraProducts as Product[],
    appleProducts as Product[],
    lgProducts as Product[],
  ];
  for (const source of sources) {
    for (const p of source) {
      const key = p.goodsNo || p.id;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      all.push(p);
    }
  }
  return all;
}

// --- PocketBase API 함수 ---

export async function getAllProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return getAllProductsFromJson();
  }
}

export async function getProductsByPickType(
  pickType: string
): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: `pickType = "${pickType}"`,
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return getAllProductsFromJson().filter((p) => p.pickType === pickType);
  }
}

export async function getProductsByCategory(
  categoryName: string
): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: `categoryName = "${categoryName}"`,
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return getAllProductsFromJson().filter(
      (p) => p.categoryName === categoryName
    );
  }
}

export async function getProductById(
  goodsNo: string
): Promise<Product | null> {
  try {
    const record = await createPB()
      .collection('products')
      .getFirstListItem(`goodsNo = "${goodsNo}"`);
    return recordToProduct(record);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    const all = getAllProductsFromJson();
    return all.find((p) => p.goodsNo === goodsNo || p.id === goodsNo) || null;
  }
}

export async function getTimedealProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'isTimedeal = true',
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return (timedealProducts as Product[]).slice();
  }
}

export async function getDealProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'pickType != "" && pickType != "none"',
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return (dealProducts as Product[]).slice();
  }
}

export async function getBestProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'reviewCnt > 0',
      sort: '-reviewCnt',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return (bestProducts as Product[]).slice();
  }
}

export async function getReviewProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'reviewCnt > 0 && reviewAvg > 0',
      sort: '-reviewAvg',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    return (reviewProducts as Product[]).slice();
  }
}

export async function getSamsungProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'brandName = "삼성전자"',
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    return (samsungProducts as Product[]).slice();
  }
}

export async function getOverseasProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'scmNo >= "700" && scmNo <= "799"',
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    return (overseasProducts as Product[]).slice();
  }
}

export async function getLgProducts(): Promise<Product[]> {
  try {
    const records = await createPB().collection('products').getFullList({
      filter: 'brandName = "LG전자"',
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    return (lgProducts as Product[]).slice();
  }
}

const SMART_CATEGORY_KEYS = [
  'robotic_vacuum_cleaner',
  'cordless_vacuum_cleaner',
  'air_purifier',
  'smart_watch',
  'tv',
  'induction',
  'dish_washer',
  'speaker',
  'headphone',
  'game_console',
  'smartphone',
  'foldable_phone',
  'tablet',
  'lg_gram',
  'lg_oled_tv',
  'lg_styler',
  'lg_aircon',
  'apple_watch',
  'apple_accessory',
];

export async function getSmartProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.productCategoryKey && SMART_CATEGORY_KEYS.includes(p.productCategoryKey));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  try {
    const records = await createPB().collection('products').getFullList({
      filter: `goodsNm ~ "${q}" || brandName ~ "${q}" || categoryName ~ "${q}"`,
      sort: '-created',
    });
    return records.map(recordToProduct);
  } catch {
    console.warn('[PocketBase] 연결 실패 - JSON fallback 사용');
    const all = getAllProductsFromJson();
    return all.filter(
      (p) =>
        p.goodsNm.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }
}

export async function getProductsByRecommendationCategory(
  categoryKey: string
): Promise<Product[]> {
  const category = RECOMMENDATION_CATEGORIES.find(
    (c) => c.key === categoryKey
  );
  if (!category) return [];

  const all = await getAllProducts();
  return all.filter(
    (p) => p.productCategoryKey && category.keys.includes(p.productCategoryKey)
  );
}

export async function getProductsGroupedByCategory(): Promise<
  { category: CategoryInfo; products: Product[] }[]
> {
  const all = await getAllProducts();

  return RECOMMENDATION_CATEGORIES.map((category) => ({
    category,
    products: all.filter(
      (p) =>
        p.productCategoryKey && category.keys.includes(p.productCategoryKey)
    ),
  })).filter((group) => group.products.length > 0);
}

export function getCategoryByKey(key: string): CategoryInfo | undefined {
  return RECOMMENDATION_CATEGORIES.find((c) => c.key === key);
}
