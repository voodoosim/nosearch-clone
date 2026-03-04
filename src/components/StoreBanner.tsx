import Image from "next/image";

const BANNERS: Record<string, { src: string; alt: string }> = {
  deal: {
    src: "/images/store_banner_nosearchDeal.png",
    alt: "스마트홈딜이 먼저 써보고 추천하는 가전제품 최저가 공동구매!",
  },
  reviewTem: {
    src: "/images/store_banner_reviewTem.png",
    alt: "스마트홈딜이 직접 써보고 추천하는 리뷰템",
  },
  timedeal: {
    src: "/images/store_banner_timedeal.png",
    alt: "놓치면 후회할 타임딜",
  },
  best: {
    src: "/images/store_banner_best.png",
    alt: "이번주 인기 상품",
  },
  rental: {
    src: "/images/store_banner_rental.png",
    alt: "렌탈 상품",
  },
};

export default function StoreBanner({ type }: { type: string }) {
  const banner = BANNERS[type];
  if (!banner) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1125 / 600' }}>
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        className="object-contain"
        priority
        sizes="100vw"
      />
    </div>
  );
}
