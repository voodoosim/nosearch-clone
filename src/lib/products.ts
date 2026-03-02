import type { Product } from '@/components/ProductCard';
import bestProducts from '@/data/products-best.json';
import dealProducts from '@/data/products-deal.json';
import timedealProducts from '@/data/products-timedeal.json';
import reviewProducts from '@/data/products-review.json';

export interface CategoryInfo {
  key: string;
  label: string;
  icon: string;
  description: string;
  keys: string[];
}

export const RECOMMENDATION_CATEGORIES: CategoryInfo[] = [
  {
    key: 'kitchen',
    label: '주방가전',
    icon: '🍳',
    description: '요리와 주방 생활을 더 편리하게 만들어주는 가전제품',
    keys: ['dish_washer', 'blender', 'air_fryer', 'electric_pot'],
  },
  {
    key: 'cleaning',
    label: '청소가전',
    icon: '🧹',
    description: '깨끗한 집을 위한 스마트 청소 가전',
    keys: ['cordless_vacuum_cleaner', 'robotic_vacuum_cleaner', 'mop_cleaner'],
  },
  {
    key: 'living',
    label: '생활가전',
    icon: '🏠',
    description: '일상을 더 편리하게 만들어주는 생활 가전',
    keys: ['water_purifier', 'bidet', 'smart_trash_can', 'garbage_disposer'],
  },
  {
    key: 'seasonal',
    label: '계절가전',
    icon: '🌡️',
    description: '계절에 맞는 쾌적한 환경을 위한 가전',
    keys: [
      'dehumidifier',
      'humidifier',
      'electric_fan',
      'fan_heater',
      'electric_mattress',
      'bathroom_heater',
      'air_circulator',
    ],
  },
  {
    key: 'health',
    label: '건강/뷰티',
    icon: '💆',
    description: '건강하고 아름다운 생활을 위한 제품',
    keys: ['water_toothpick', 'hair_dryer', 'shoulder_massage'],
  },
];

const CATEGORY_KEY_LABELS: Record<string, string> = {
  dish_washer: '식기세척기',
  blender: '블렌더',
  air_fryer: '에어프라이어',
  electric_pot: '전기포트',
  cordless_vacuum_cleaner: '무선청소기',
  robotic_vacuum_cleaner: '로봇청소기',
  mop_cleaner: '물걸레청소기',
  water_purifier: '정수기',
  bidet: '비데',
  smart_trash_can: '스마트 휴지통',
  garbage_disposer: '음식물처리기',
  dehumidifier: '제습기',
  humidifier: '가습기',
  electric_fan: '선풍기',
  fan_heater: '온풍기',
  electric_mattress: '전기요',
  bathroom_heater: '욕실난방기',
  air_circulator: '써큘레이터',
  water_toothpick: '구강세정기',
  hair_dryer: '헤어드라이어',
  shoulder_massage: '어깨안마기',
};

export function getCategoryKeyLabel(key: string): string {
  return CATEGORY_KEY_LABELS[key] || key;
}

export function getAllProducts(): Product[] {
  const seen = new Set<string>();
  const all: Product[] = [];

  const sources = [
    bestProducts as Product[],
    dealProducts as Product[],
    timedealProducts as Product[],
    reviewProducts as Product[],
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

export function getProductsByRecommendationCategory(
  categoryKey: string
): Product[] {
  const category = RECOMMENDATION_CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return [];

  const all = getAllProducts();
  return all.filter(
    (p) => p.productCategoryKey && category.keys.includes(p.productCategoryKey)
  );
}

export function getProductsGroupedByCategory(): {
  category: CategoryInfo;
  products: Product[];
}[] {
  const all = getAllProducts();

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
