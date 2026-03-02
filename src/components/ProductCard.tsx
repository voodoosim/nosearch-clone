import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";

interface Product {
  id: string;
  goodsNo: string;
  goodsNm: string;
  brandName: string;
  categoryName: string;
  goodsPrice: number;
  fixedPrice: number;
  imageUrl: string;
  pickType: string;
  soldOutFl: string;
  reviewAvg: number;
  reviewCnt: number;
  productCategoryKey?: string;
  periodDiscountEnd?: string;
  isTimedeal?: boolean;
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function getPickPrefix(pickType: string) {
  switch (pickType) {
    case "best":
      return "[베스트픽]";
    case "cost_effective":
      return "[가성비픽]";
    case "plus":
      return "[PLUS픽]";
    case "premium":
      return "[프리미엄픽]";
    default:
      return "";
  }
}

const RECOMMEND_TITLE: Record<string, string> = {
  dehumidifier: "스마트홈딜이 추천하는 최고의 제습기🥇\n습한 여름, 쾌적한 실내를 위한 필수 가전!",
  steam_iron: "스마트홈딜이 추천하는 최고의 스팀다리미🥇\n구김 없는 깔끔한 옷매무새의 비결!✨",
  blender: "스마트홈딜이 추천하는 최고의 블렌더🥇\n초고속 분쇄력으로 건강한 식단을 완성!",
  mop_cleaner: "스마트홈딜이 추천하는 최고의 물걸레청소기🥇\n깔끔한 바닥을 위한 똑똑한 선택!",
  dish_washer: "스마트홈딜이 추천하는 최고의 식기세척기🥇\n설거지 스트레스에서 해방!✨",
  humidifier: "스마트홈딜이 추천하는 최고의 가습기🥇\n촉촉한 실내를 위한 필수 가전!",
  air_fryer: "스마트홈딜이 추천하는 최고의 에어프라이어🥇\n바삭한 요리를 간편하게!",
  beam_projector: "스마트홈딜이 추천하는 최고의 빔프로젝터🥇\n홈시네마의 완성🎬 집이 영화관으로!✨",
  fan_heater: "스마트홈딜이 추천하는 최고의 온풍기🥇\n따뜻한 겨울을 위한 똑똑한 선택!",
  cordless_vacuum_cleaner: "스마트홈딜이 추천하는 최고의 무선청소기🥇\n가벼운 무게, 강력한 흡입력!",
  bathroom_heater: "스마트홈딜이 추천하는 최고의 욕실난방기🥇\n추운 겨울 욕실을 따뜻하게!",
  electric_pot: "스마트홈딜이 추천하는 최고의 전기포트🥇\n빠르고 편리한 물 끓이기!",
  bath_towel: "스마트홈딜이 추천하는 최고의 수건🥇\n부드럽고 흡수력 좋은 프리미엄 타올!",
  smart_trash_can: "스마트홈딜이 추천하는 최고의 스마트 휴지통🥇\n자동 센서로 편리하게!",
  water_toothpick: "스마트홈딜이 추천하는 최고의 구강세정기🥇\n치아 건강을 위한 스마트한 선택!",
  wireless_charger: "스마트홈딜이 추천하는 최고의 무선충전기🥇\n간편한 충전, 깔끔한 데스크!",
  electric_mattress: "스마트홈딜이 추천하는 최고의 전기요🥇\n포근한 겨울밤을 위한 필수템!",
  robotic_vacuum_cleaner: "스마트홈딜이 추천하는 최고의 로봇청소기🥇\n자동으로 깨끗한 바닥!",
  electric_fan: "스마트홈딜이 추천하는 최고의 선풍기🥇\n시원한 여름을 위한 스마트 선택!",
  shoulder_massage: "스마트홈딜이 추천하는 최고의 어깨안마기🥇\n뭉친 어깨를 시원하게!",
  water_purifier: "스마트홈딜이 추천하는 최고의 정수기🥇\n깨끗한 물, 건강한 생활!",
  bidet: "스마트홈딜이 추천하는 최고의 비데🥇\n쾌적한 욕실 생활의 시작!",
  garbage_disposer: "스마트홈딜이 추천하는 최고의 음식물처리기🥇\n냄새 없는 깨끗한 주방!",
  air_circulator: "스마트홈딜이 추천하는 최고의 써큘레이터🥇\n효율적인 공기 순환!",
  hair_dryer: "스마트홈딜이 추천하는 최고의 헤어드라이어🥇\n빠른 건조, 부드러운 모발!",
  bluetooth_earphone: "스마트홈딜이 추천하는 최고의 블루투스 이어폰🥇\n선 없는 자유로운 음악!",
};

const RECOMMEND_DESC: Record<string, string> = {
  dehumidifier: "뛰어난 제습 성능과 에너지 효율로 인정받은 제품을 스마트홈딜 공동구매 최저가로 만나보세요!",
  steam_iron: "강력한 스팀과 편리한 사용성으로 인정받은 제품을 스마트홈딜 공동구매 최저가로 만나보세요!",
  blender: "강력한 분쇄력과 다양한 기능으로 인정받은 제품을 스마트홈딜 공동구매 최저가로 만나보세요!",
};

export default function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.soldOutFl === "y";
  const pickPrefix = getPickPrefix(product.pickType);
  const discount = product.fixedPrice > product.goodsPrice
    ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
    : 0;

  const title = RECOMMEND_TITLE[product.productCategoryKey || ""] ||
    `스마트홈딜이 추천하는 최고의 ${product.categoryName}🥇\n전문가가 직접 써보고 추천하는 제품!`;
  const desc = RECOMMEND_DESC[product.productCategoryKey || ""] ||
    "우수한 성능으로 인정받은 제품을 스마트홈딜 공동구매 최저가로 만나보세요. 수량한정 할인가를 놓치지 마세요!";

  const productName = pickPrefix
    ? `${pickPrefix} ${product.goodsNm}`
    : product.goodsNm;

  const href = `/store/product/${product.goodsNo || product.id}`;

  return (
    <Link href={href} className="block group">
      <article className="w-full overflow-hidden bg-blue-1 p-[10px] lg:p-[20px] transition-shadow duration-200 group-hover:shadow-md group-hover:ring-1 group-hover:ring-blue-7/20">
        {/* 미디어 영역 — 원본: 비디오(16:9) + 타이머 바 */}
        <div className="relative w-full shrink-0">
          <div className="relative w-full bg-white" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={product.imageUrl}
              alt={product.goodsNm}
              fill
              className={`object-contain p-[10px] lg:p-[20px] transition-transform duration-200 group-hover:scale-[1.02] ${isSoldOut ? "opacity-40" : ""}`}
              sizes="(max-width: 1024px) 90vw, 480px"
            />
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-[20px] font-bold text-white">SOLD OUT</span>
              </div>
            )}
          </div>
          {/* 타이머 바 — 이미지 아래 별도 영역 */}
          {!isSoldOut && product.periodDiscountEnd && (
            <div className="w-full bg-gray-9 py-[3px] text-center">
              <span className="text-[13px] font-bold text-white">
                <CountdownTimer endDate={product.periodDiscountEnd} />
              </span>
            </div>
          )}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="mt-[12px]">
          {/* 추천 문구 */}
          <div>
            <p className="mb-[4px] line-clamp-2 break-all text-[13px] lg:text-[20px] font-bold leading-[1.5] lg:leading-[30px] text-gray-10 whitespace-pre-line">
              {title}
            </p>
            <p className="mb-[12px] line-clamp-2 break-all text-[11px] lg:text-[14px] font-medium leading-[1.5] lg:leading-[21px] text-gray-10">
              {desc}
            </p>
          </div>

          {/* 상품 정보 + 가격 */}
          <div className="border-t border-gray-3 pt-[12px]">
            <p className="mb-[4px] line-clamp-1 break-all text-[14px] lg:text-[22px] font-extrabold leading-[1.5] lg:leading-[33px] text-gray-10 group-hover:text-blue-7 transition-colors">
              {productName}
            </p>
            <div className="relative flex items-center">
              {discount > 0 && (
                <div className="mr-[10px]">
                  <div className="inline-flex h-[28px] items-center px-[8px] text-[12px] font-extrabold leading-none text-white" style={{ backgroundColor: '#E8701A' }}>
                    최저가 이하 특가
                  </div>
                </div>
              )}
              <p className="mr-[8px] text-[18px] lg:text-[24px] font-extrabold text-gray-10">
                {formatPrice(product.goodsPrice)}원
              </p>
              {discount > 0 && (
                <p className="text-[13px] font-medium text-gray-6 line-through">
                  {formatPrice(product.fixedPrice)}원
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export type { Product };
