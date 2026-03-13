'use client';

import { useState, useRef } from 'react';

interface Product {
  goodsNm: string;
  brandName: string;
  categoryName: string;
  goodsNo: string;
  id: string;
  reviewAvg: number;
  reviewCnt: number;
  goodsPrice: number;
  fixedPrice: number;
  pickType: string;
  soldOutFl: string;
  imageUrl: string;
  productCategoryKey?: string;
  periodDiscountEnd?: string;
  isTimedeal?: boolean;
}

interface Props {
  product: Product;
  discount: number;
}

const TABS = [
  { id: 'info', label: '상품정보' },
  { id: 'spec', label: '제품 사양' },
  { id: 'review', label: `리뷰` },
  { id: 'shipping', label: '배송/반품' },
];

// 상품명 파싱으로 Apple 사양 추출
// 일반 가전 스펙 파서 (상품명에서 추출)
function parseGeneralSpecs(goodsNm: string, categoryKey?: string, brandName?: string): Record<string, string> {
  const name = goodsNm;
  const specs: Record<string, string> = {};

  if (brandName) specs['브랜드'] = brandName;

  // 출력/흡입력 W / AW
  const wattMatch = name.match(/(\d[\d,]+)\s*(AW|W)\b/);
  if (wattMatch) {
    const label = categoryKey?.includes('vacuum') ? '흡입력' : '출력';
    specs[label] = `${wattMatch[1]}${wattMatch[2]}`;
  }

  // 청정 면적 m²
  const areaMatch = name.match(/(\d+)\s*m[²2]/);
  if (areaMatch) specs['청정 면적'] = `${areaMatch[1]}m²`;

  // HEPA 등급
  const hepaMatch = name.match(/HEPA\s*(\d+)등급/);
  if (hepaMatch) specs['필터'] = `HEPA ${hepaMatch[1]}등급`;

  // 화구 수 (인덕션)
  const burnerMatch = name.match(/(\d+)구/);
  if (burnerMatch) specs['화구'] = `${burnerMatch[1]}구`;

  // 용량 L
  const litreMatch = name.match(/(\d+(?:\.\d+)?)\s*L\b/);
  if (litreMatch) specs['용량'] = `${litreMatch[1]}L`;

  // 인용 (식기세척기)
  const personMatch = name.match(/(\d+)인용/);
  if (personMatch) specs['용량'] = `${personMatch[1]}인용`;

  // 스팀 g/min
  const steamMatch = name.match(/(\d+)\s*g\/min/);
  if (steamMatch) specs['스팀량'] = `${steamMatch[1]}g/min`;

  // 압력 바 (커피머신)
  const barMatch = name.match(/(\d+)\s*바/);
  if (barMatch) specs['압력'] = `${barMatch[1]}바`;

  // 화면 크기 형/인치
  const screenMatch = name.match(/(\d+(?:\.\d+)?)\s*형/);
  if (screenMatch) specs['화면 크기'] = `${screenMatch[1]}형`;

  // 인치
  const inchMatch = name.match(/"(\d+(?:\.\d+)?)"/) || name.match(/(\d+(?:\.\d+)?)[""]/);
  if (inchMatch && !screenMatch) specs['화면 크기'] = `${inchMatch[1]}"`;

  // mm (스마트워치 케이스)
  const mmMatch = name.match(/(\d+)\s*mm/);
  if (mmMatch) specs['케이스 크기'] = `${mmMatch[1]}mm`;

  // 디스플레이 타입
  if (name.includes('AMOLED')) specs['디스플레이'] = 'AMOLED';
  else if (name.includes('QLED')) specs['디스플레이'] = 'QLED';
  else if (name.includes('4K')) specs['해상도'] = '4K UHD';
  else if (name.includes('UHD')) specs['해상도'] = '4K UHD';

  // HDR
  if (name.includes('HDR')) specs['HDR'] = '지원';

  // ANC
  if (name.includes('ANC') || name.includes('노이즈캔슬링')) specs['노이즈캔슬링'] = 'ANC 지원';

  // AI
  if (name.includes('AI')) specs['AI'] = '탑재';

  // 7-in-1 등 다기능
  const multiMatch = name.match(/(\d+)-in-(\d+)/);
  if (multiMatch) specs['다기능'] = `${multiMatch[1]}-in-${multiMatch[2]}`;

  // 프로그램 수
  const progMatch = name.match(/(\d+)가지\s*(?:스마트\s*)?프로그램/);
  if (progMatch) specs['프로그램'] = `${progMatch[1]}가지`;

  // 물걸레 겸용
  if (name.includes('물걸레')) specs['물걸레'] = '겸용';

  // 자동먼지비움
  if (name.includes('자동먼지비움')) specs['먼지통'] = '자동 비움';

  // 레이저 먼지감지
  if (name.includes('레이저')) specs['먼지감지'] = '레이저 감지';

  return specs;
}

// 카테고리별 일반 제품 특징
function getGeneralHighlights(product: {
  goodsNm: string;
  brandName: string;
  categoryName: string;
  productCategoryKey?: string;
  goodsPrice: number;
  fixedPrice: number;
  reviewAvg: number;
  reviewCnt: number;
}): { title: string; desc: string }[] {
  const name = product.goodsNm;
  const key = product.productCategoryKey || '';
  const highlights: { title: string; desc: string }[] = [];

  // 무선청소기
  if (key === 'cordless_vacuum_cleaner') {
    const wMatch = name.match(/(\d[\d,]+)\s*(AW|W)\b/);
    highlights.push(
      { title: wMatch ? `강력한 ${wMatch[1]}${wMatch[2]} 흡입력` : '강력한 흡입력', desc: '먼지와 이물질을 강력하게 흡입. 카펫, 마루, 틈새 먼지까지 깨끗하게 처리' },
      { title: '자유로운 무선 청소', desc: '코드 없이 집 안 어디든 자유롭게 이동하며 청소 가능' },
      { title: '다양한 청소 모드', desc: '일반/강력 모드 전환으로 상황에 맞는 효율적인 청소' },
      { title: '간편한 먼지통 비움', desc: '원터치 버튼으로 먼지통을 간편하게 비울 수 있어 위생적' },
    );
  }
  // 로봇청소기
  else if (key === 'robotic_vacuum_cleaner') {
    const hasAI = name.includes('AI');
    const hasMop = name.includes('물걸레');
    const hasAutoEmpty = name.includes('자동먼지비움');
    highlights.push(
      { title: `${hasAI ? 'AI ' : ''}스마트 자율 주행`, desc: `${hasAI ? 'AI 기반 장애물 인식으로 가구와 물건을 정확하게 피하며 ' : ''}자동으로 경로를 계획해 빈틈 없이 청소` },
      { title: hasMop ? '청소+물걸레 동시 처리' : '자동 청소', desc: hasMop ? '먼지 흡입과 물걸레질을 한 번에 처리해 바닥을 깨끗하게 관리' : '스케줄 설정으로 집을 비워도 자동으로 청소' },
      { title: hasAutoEmpty ? '자동 먼지비움 스테이션' : '대용량 먼지통', desc: hasAutoEmpty ? '청소 후 먼지통을 자동으로 비워주는 스테이션으로 30일 이상 먼지통 관리 불필요' : '대용량 먼지통으로 자주 비우지 않아도 됨' },
      { title: '앱/음성 제어', desc: '스마트폰 앱과 음성 명령으로 어디서든 편리하게 제어 가능' },
    );
  }
  // 공기청정기
  else if (key === 'air_purifier') {
    const areaMatch = name.match(/(\d+)\s*m[²2]/);
    const hepaMatch = name.match(/HEPA\s*(\d+)등급/);
    highlights.push(
      { title: areaMatch ? `${areaMatch[1]}m² 넓은 공간 커버` : '넓은 청정 면적', desc: `${areaMatch ? areaMatch[1] + 'm² ' : ''}공간을 빠르고 효율적으로 공기 정화` },
      { title: hepaMatch ? `HEPA ${hepaMatch[1]}등급 필터` : '고성능 필터', desc: `미세먼지(PM2.5), 초미세먼지, 꽃가루, 박테리아까지 99.97% 이상 포집` },
      { title: '자동 공기질 감지', desc: '실시간 공기질 센서로 오염도를 감지해 자동으로 팬 속도 조절' },
      { title: '저소음 야간 모드', desc: '취침 시 최소 소음으로 작동해 수면을 방해하지 않음' },
    );
  }
  // 인덕션
  else if (key === 'induction') {
    const wMatch = name.match(/(\d[\d,]+)\s*W/);
    const burnerMatch = name.match(/(\d+)구/);
    highlights.push(
      { title: wMatch ? `최대 ${wMatch[1]}W 강력 화력` : '강력 화력', desc: `${wMatch ? wMatch[1] + 'W ' : ''}고출력으로 빠른 조리 가능. 끓이기, 볶기, 튀기기 모두 강력하게 처리` },
      { title: burnerMatch ? `${burnerMatch[1]}구 동시 조리` : '다용도 조리', desc: `${burnerMatch ? burnerMatch[1] + '개 화구를 동시에 사용해 ' : ''}여러 요리를 한 번에 조리 가능` },
      { title: '안전한 전자기 가열', desc: '용기만 가열해 주변 화상 위험 없음. 아이·반려동물이 있는 가정에 안전' },
      { title: '쉬운 청소', desc: '평면 유리 상판으로 음식물이 눌어붙지 않아 닦기만 해도 깨끗하게 유지' },
    );
  }
  // 식기세척기
  else if (key === 'dish_washer') {
    const personMatch = name.match(/(\d+)인용/);
    highlights.push(
      { title: personMatch ? `${personMatch[1]}인 가족용 대용량` : '대용량 세척', desc: `${personMatch ? personMatch[1] + '인 가족 기준 1~2끼 분량의 식기를 ' : ''}한 번에 세척 가능` },
      { title: '고온 살균 세척', desc: '70°C 이상 고온 스팀 세척으로 식중독균과 세균을 99.9% 제거' },
      { title: '절수·절전 효과', desc: '손 설거지 대비 물 최대 70% 절약. 장기적으로 수도·전기 요금 절감' },
      { title: '다양한 세척 코스', desc: '일반/고온/빠른 세척/에코 등 상황에 맞는 코스 선택 가능' },
    );
  }
  // 커피머신
  else if (key === 'coffee_maker') {
    const barMatch = name.match(/(\d+)\s*바/);
    highlights.push(
      { title: barMatch ? `${barMatch[1]}바 고압 추출` : '고압 에스프레소 추출', desc: `${barMatch ? barMatch[1] + '바 압력으로 ' : ''}카페 수준의 진한 크레마와 깊은 풍미 구현` },
      { title: '전문 바리스타 수준', desc: '스팀 노즐로 우유 거품 생성 가능. 라떼, 카푸치노, 마키아토 등 다양한 메뉴 제조' },
      { title: '빠른 예열', desc: '전원 ON 후 수초 내 추출 가능한 빠른 예열 시스템' },
      { title: '손쉬운 청소', desc: '분리형 부품 구조로 청소가 편리하고 위생적으로 관리 가능' },
    );
  }
  // 블렌더
  else if (key === 'blender') {
    const wMatch = name.match(/(\d[\d,]+)\s*W/);
    highlights.push(
      { title: wMatch ? `${wMatch[1]}W 강력 모터` : '강력한 블렌딩', desc: `${wMatch ? wMatch[1] + 'W 고출력으로 ' : ''}얼음, 냉동 과일도 부드럽게 분쇄` },
      { title: '다목적 조리 도구', desc: '스무디, 소스, 수프, 이유식 등 다양한 요리에 활용 가능' },
      { title: '인체공학적 그립', desc: '미끄럼 방지 손잡이로 안전하고 편안하게 사용' },
      { title: '식기세척기 사용 가능', desc: '분리 가능한 부품은 식기세척기 세척 가능해 편리' },
    );
  }
  // 스팀다리미
  else if (key === 'steam_iron') {
    const wMatch = name.match(/(\d[\d,]+)\s*W/);
    const steamMatch = name.match(/(\d+)\s*g\/min/);
    highlights.push(
      { title: wMatch ? `${wMatch[1]}W 고출력 스팀` : '강력 스팀', desc: `${wMatch ? wMatch[1] + 'W ' : ''}강력한 열로 두꺼운 의류의 주름까지 깔끔하게 제거` },
      { title: steamMatch ? `${steamMatch[1]}g/min 고압 스팀` : '고압 스팀', desc: `${steamMatch ? '분당 ' + steamMatch[1] + 'g의 스팀으로 ' : ''}셔츠, 정장, 두꺼운 커튼까지 빠르게 다림질` },
      { title: '수직 스팀 기능', desc: '걸어둔 상태로 옷에 직접 스팀 분사 가능. 드라이클리닝 옷도 집에서 케어' },
      { title: '탄탄한 스팀 베이스', desc: '비접착 솔플레이트로 부드럽게 미끄러지며 다림질' },
    );
  }
  // 스마트워치
  else if (key === 'smart_watch') {
    const mmMatch = name.match(/(\d+)\s*mm/);
    const hasAMOLED = name.includes('AMOLED');
    highlights.push(
      { title: mmMatch ? `${mmMatch[1]}mm 선명한 디스플레이` : '선명한 디스플레이', desc: `${hasAMOLED ? 'AMOLED ' : ''}디스플레이로 야외에서도 선명하게 정보 확인 가능` },
      { title: '건강·운동 트래킹', desc: '심박수, 혈중산소, 수면, 스트레스 등 24시간 건강 모니터링' },
      { title: '스마트폰 연동', desc: '전화, 메시지, SNS 알림을 손목에서 바로 확인. 스마트폰 없이도 다양한 기능 사용' },
      { title: '방수 설계', desc: '일상 방수 지원으로 운동 중 땀, 수영 등 물 걱정 없이 착용 가능' },
    );
  }
  // 이어폰
  else if (key === 'bluetooth_earphone') {
    const hasANC = name.includes('ANC') || name.includes('노이즈캔슬링');
    highlights.push(
      { title: hasANC ? 'ANC 액티브 노이즈 캔슬링' : '몰입감 있는 음질', desc: hasANC ? '외부 소음을 능동적으로 차단해 어느 환경에서도 음악과 통화에 집중' : '정밀한 드라이버로 풍부한 저음과 선명한 고음 구현' },
      { title: '완전 무선 자유', desc: '케이블 없는 완전 무선으로 운동, 출퇴근 등 일상에서 자유롭게 착용' },
      { title: '긴 배터리 사용 시간', desc: '케이스 포함 최대 수십 시간 재생 가능. 충전 케이스로 언제든 충전' },
      { title: '편안한 착용감', desc: '인체공학적 디자인으로 장시간 착용해도 피로감 없음' },
    );
  }
  // TV
  else if (key === 'tv') {
    const screenMatch = name.match(/(\d+)형/);
    const isQLED = name.includes('QLED');
    const is4K = name.includes('4K');
    highlights.push(
      { title: `${screenMatch ? screenMatch[1] + '형 ' : ''}${isQLED ? 'QLED ' : ''}대화면`, desc: `${screenMatch ? screenMatch[1] + '형 ' : ''}${isQLED ? 'QLED ' : ''}디스플레이로 압도적인 몰입감` },
      { title: `${is4K ? '4K UHD ' : ''}선명한 화질`, desc: `${is4K ? '4K UHD 해상도와 ' : ''}HDR로 실감나는 색감과 선명한 화질 구현` },
      { title: '스마트TV 기능', desc: '넷플릭스, 유튜브 등 OTT 앱 내장. 인터넷 연결만으로 다양한 콘텐츠 시청' },
      { title: '다양한 연결 포트', desc: 'HDMI, USB 등 다양한 포트로 게임기, 사운드바 등 기기 연결 가능' },
    );
  }
  // 전기압력밥솥
  else if (key === 'electric_rice_cooker') {
    const litreMatch = name.match(/(\d+(?:\.\d+)?)\s*L\b/);
    const multiMatch = name.match(/(\d+)-in-(\d+)/);
    const progMatch = name.match(/(\d+)가지/);
    highlights.push(
      { title: litreMatch ? `${litreMatch[1]}L 대용량` : '넉넉한 용량', desc: `${litreMatch ? litreMatch[1] + 'L 용량으로 ' : ''}가족 식사부터 파티 요리까지 한 번에 조리 가능` },
      { title: multiMatch ? `${multiMatch[1]}-in-${multiMatch[2]} 다기능` : '다양한 조리 기능', desc: `${progMatch ? progMatch[1] + '가지 ' : ''}조리 모드로 밥솥, 찜기, 압력솥, 슬로우쿠커 등 다양하게 활용` },
      { title: '빠른 압력 조리', desc: '고압 스팀으로 일반 냄비보다 30% 빠른 조리. 질긴 고기도 부드럽게' },
      { title: '안전 설계', desc: '과압 방지 밸브와 잠금 장치로 안전한 사용 보장' },
    );
  }
  // 기본 (분류 안 된 경우)
  else {
    highlights.push(
      { title: `${product.brandName} 공식 정품`, desc: '한국 공식 유통 정품으로 A/S 및 품질 보증 완비' },
      { title: '스마트홈딜 엄선 제품', desc: '전문가가 직접 테스트해 성능, 내구성, 가성비를 종합 검증한 제품' },
    );
    if (product.reviewCnt > 0) {
      highlights.push({ title: `★ ${product.reviewAvg.toFixed(1)} 높은 만족도`, desc: `실제 구매자 ${product.reviewCnt.toLocaleString('ko-KR')}명이 인정한 제품` });
    }
  }

  return highlights;
}

function parseAppleSpecs(goodsNm: string, categoryKey?: string) {
  const name = goodsNm;
  const specs: Record<string, string> = {};

  // 칩 추출
  const chipMatch = name.match(/(M\d+(?:\s+(?:Pro|Max|Ultra))?)/);
  if (chipMatch) specs['칩'] = `Apple Silicon ${chipMatch[1]}`;

  // CPU 코어 추출
  const cpuMatch = name.match(/(\d+)코어\s+CPU/);
  if (cpuMatch) specs['CPU'] = `${cpuMatch[1]}코어`;

  // GPU 코어 추출
  const gpuMatch = name.match(/(\d+)코어\s+GPU/);
  if (gpuMatch) specs['GPU'] = `${gpuMatch[1]}코어`;

  // 메모리 추출
  const memMatch = name.match(/(\d+)GB(?!\s+\d)/);
  if (memMatch) specs['통합 메모리'] = `${memMatch[1]}GB`;

  // 저장장치 추출
  const storageMatch = name.match(/(\d+(?:\.\d+)?)(TB|GB)$/);
  if (storageMatch) specs['SSD 저장 용량'] = `${storageMatch[1]}${storageMatch[2]}`;

  // 색상 추출
  if (name.includes('스페이스 블랙')) specs['색상'] = '스페이스 블랙';
  else if (name.includes('실버')) specs['색상'] = '실버';
  else if (name.includes('스페이스 그레이')) specs['색상'] = '스페이스 그레이';
  else if (name.includes('골드')) specs['색상'] = '골드';
  else if (name.includes('미드나이트')) specs['색상'] = '미드나이트';

  // 디스플레이 (카테고리 기반)
  if (categoryKey === 'macbook_pro_14' || name.includes('14"')) {
    specs['디스플레이'] = '14.2형 Liquid Retina XDR (3024 × 1964)';
    specs['배터리'] = '최대 22시간 (Apple TV 앱 동영상 재생)';
    specs['무게'] = '1.62 kg';
  } else if (categoryKey === 'macbook_pro_16' || name.includes('16"')) {
    specs['디스플레이'] = '16.2형 Liquid Retina XDR (3456 × 2234)';
    specs['배터리'] = '최대 24시간 (Apple TV 앱 동영상 재생)';
    specs['무게'] = '2.14 kg';
  } else if (categoryKey === 'mac_studio') {
    specs['연결'] = 'Thunderbolt 5 × 3, USB-A × 2, USB-C × 3, HDMI, SD카드, 오디오 잭';
    specs['크기'] = '19.7 × 19.7 × 9.5 cm';
  } else if (categoryKey === 'mac_pro') {
    specs['폼 팩터'] = '타워형 워크스테이션';
    specs['연결'] = 'Thunderbolt 4 × 6, USB-A × 2, HDMI × 2, 10Gb 이더넷 × 2';
    specs['확장 슬롯'] = 'PCIe 슬롯 × 6';
  } else if (categoryKey === 'mac_mini') {
    specs['디스플레이'] = '최대 3개 동시 연결 지원';
    specs['연결'] = 'Thunderbolt 4 × 3, USB-A × 2, HDMI, 이더넷 10Gb';
    specs['크기'] = '12.7 × 12.7 × 3.6 cm';
  }

  // MacBook Pro 공통
  if (categoryKey === 'macbook_pro_14' || categoryKey === 'macbook_pro_16') {
    specs['카메라'] = '12MP Center Stage 지원 카메라';
    specs['오디오'] = '6스피커 사운드 시스템, 공간 음향';
    specs['연결'] = 'Thunderbolt 4 × 3, HDMI, SD카드, MagSafe 3, 오디오 잭';
    specs['보안'] = 'Touch ID';
    specs['운영체제'] = 'macOS Sequoia';
  }

  return specs;
}

// 카테고리별 주요 특징
function getAppleHighlights(categoryKey?: string, chipName?: string) {
  const chip = chipName || 'Apple Silicon';

  const highlights: { title: string; desc: string }[] = [];

  if (categoryKey === 'macbook_pro_14' || categoryKey === 'macbook_pro_16') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '압도적인 CPU·GPU·Neural Engine 성능으로 전문가 작업도 거침없이 처리' },
      { title: 'Liquid Retina XDR 디스플레이', desc: '1,000,000:1 명암비, ProMotion 최대 120Hz, P3 와이드 컬러 지원' },
      { title: '최대 24시간 배터리', desc: '충전 없이도 하루 종일 작업 가능한 놀라운 배터리 효율' },
      { title: 'MagSafe 3 충전', desc: '자석 방식의 안전한 충전 연결, Thunderbolt로도 충전 가능' },
      { title: '팬 없는 설계 (기본형)', desc: '완전 무음 동작으로 조용한 환경에서도 최적의 성능 발휘' },
    );
  } else if (categoryKey === 'mac_studio') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '영상 편집, 3D 렌더링, 음악 프로덕션 등 크리에이티브 작업의 새 기준' },
      { title: '컴팩트한 고성능 데스크탑', desc: '손바닥 크기의 본체에 전문가급 성능 집약' },
      { title: 'Thunderbolt 5 포트', desc: '초고속 외장 스토리지 및 다중 디스플레이 연결 지원' },
      { title: '최대 5개 디스플레이 연결', desc: '넓은 작업 화면으로 멀티태스킹 극대화' },
    );
  } else if (categoryKey === 'mac_pro') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '192GB 통합 메모리로 초대형 프로젝트도 거침없이 처리' },
      { title: 'PCIe 슬롯 6개', desc: '전문가용 확장 카드, 외장 GPU, 전문 오디오 인터페이스 등 무한 확장' },
      { title: '최대 6개 디스플레이 연결', desc: 'Apple Pro Display XDR 최대 6대 동시 연결 지원' },
      { title: '서버 및 영상 프로덕션용', desc: 'RED RAW 4K/8K 스트림 처리, 영화 후반 작업에 최적화' },
    );
  } else if (categoryKey === 'mac_mini') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '작은 크기에 담긴 놀라운 성능, 일상부터 전문 작업까지 완벽 대응' },
      { title: '초소형 폼 팩터', desc: '12.7 × 12.7 cm의 작은 본체로 데스크 공간 절약' },
      { title: '10Gb 이더넷 내장', desc: '고속 네트워크 환경에서 빠른 파일 전송 및 서버 작업 지원' },
      { title: '최대 3대 디스플레이', desc: '다중 모니터 작업 환경 구축 가능' },
    );
  }

  return highlights;
}

function StarRating({ avg, cnt }: { avg: number; cnt: number }) {
  if (cnt === 0) return null;
  const fullStars = Math.floor(avg);
  const hasHalf = avg - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-[6px]">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-[18px] h-[18px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="w-[18px] h-[18px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-[18px] h-[18px] text-gray-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[15px] font-bold text-amber-500">{avg.toFixed(1)}</span>
      <span className="text-[13px] text-gray-6">({cnt.toLocaleString('ko-KR')}개)</span>
    </div>
  );
}

export default function TabSection({ product, discount }: Props) {
  const [activeTab, setActiveTab] = useState('info');
  const infoRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    info: infoRef,
    spec: specRef,
    review: reviewRef,
    shipping: shippingRef,
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const ref = sectionRefs[tabId];
    if (ref?.current) {
      const offset = 100;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const APPLE_KEYS = ['macbook_pro_14', 'macbook_pro_16', 'mac_studio', 'mac_pro', 'mac_mini'];
  const isApple = APPLE_KEYS.includes(product.productCategoryKey || '');

  const specs = isApple
    ? parseAppleSpecs(product.goodsNm, product.productCategoryKey)
    : parseGeneralSpecs(product.goodsNm, product.productCategoryKey, product.brandName);
  const chipMatch = product.goodsNm.match(/(M\d+(?:\s+(?:Pro|Max|Ultra))?)/);
  const highlights = isApple
    ? getAppleHighlights(product.productCategoryKey, chipMatch?.[1])
    : getGeneralHighlights(product);

  return (
    <div className="mt-[48px]">
      {/* 탭 바 */}
      <div className="sticky top-[100px] lg:top-[125px] z-[50] bg-[#F0EAE0] border-b border-gray-3 mb-[32px]">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 min-w-[80px] py-[14px] text-[13px] lg:text-[14px] font-semibold transition-colors relative whitespace-nowrap px-[4px] ${
                activeTab === tab.id
                  ? 'text-blue-7'
                  : 'text-gray-6 hover:text-gray-9'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-7 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 상품정보 섹션 */}
      <div ref={infoRef} id="section-info">
        {/* 주요 특징 */}
        {highlights.length > 0 && (
          <div className="mb-[32px]">
            <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
              <span className="w-[4px] h-[18px] bg-blue-7 rounded-full inline-block" />
              이 제품의 핵심 특징
            </h3>
            <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
                  <div className="shrink-0 w-[36px] h-[36px] rounded-full bg-blue-7 flex items-center justify-center mt-[2px]">
                    <span className="text-white font-extrabold text-[14px]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-10 mb-[4px]">{h.title}</p>
                    <p className="text-[13px] text-gray-6 leading-[1.6]">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 스마트홈딜 추천 박스 */}
        <div className="bg-blue-1 rounded-2xl p-[24px] lg:p-[32px] mb-[32px]">
          <div className="flex flex-col gap-[16px]">
            <div>
              <p className="text-[18px] font-extrabold text-gray-10 mb-[8px]">
                스마트홈딜이 추천하는 이유
              </p>
              <p className="text-[14px] text-gray-9 leading-[1.7]">
                {product.brandName}의 {product.categoryName}은 전문가가 직접 사용하고 엄선한 제품입니다.
                성능, 디자인, 내구성을 종합 평가하여 최고 점수를 받은 모델로,
                고가의 투자 가치가 충분한 프리미엄 제품입니다.
              </p>
            </div>

            <div className="border-t border-gray-3 pt-[16px]">
              <ul className="flex flex-col gap-[10px]">
                <li className="flex items-start gap-[10px]">
                  <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                    <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-gray-9">스마트홈딜 전문가 직접 테스트 및 검증 완료</span>
                </li>
                <li className="flex items-start gap-[10px]">
                  <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                    <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-gray-9">
                    {isApple ? 'Apple 공식 정품 인증 제품 (정품 시리얼 포함)' : `${product.brandName} 정품 인증 제품`}
                  </span>
                </li>
                {product.reviewCnt > 0 && (
                  <li className="flex items-start gap-[10px]">
                    <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                      <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-gray-9">
                      실제 구매자 {product.reviewCnt.toLocaleString('ko-KR')}명의 평균 {product.reviewAvg.toFixed(1)}점 높은 만족도
                    </span>
                  </li>
                )}
                {discount >= 5 && (
                  <li className="flex items-start gap-[10px]">
                    <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                      <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-gray-9">
                      {isApple ? `Apple 공식가 대비 ${discount}% 할인 — 공동구매 최저가 보장` : `정가 대비 ${discount}% 할인 — 최저가 보장`}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 구매 혜택 섹션 */}
        <div className="mb-[32px]">
          <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
            <span className="w-[4px] h-[18px] bg-amber-500 rounded-full inline-block" />
            구매 혜택
          </h3>
          <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-2">
            {/* 공동구매 특가 */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#3B82F6" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-9 mb-[4px]">공동구매 특가</p>
                <p className="text-[12px] text-gray-6 leading-snug">10명 이상 모이면 추가 할인<br />{isApple ? `Apple 공식가 대비 최대 ${Math.max(discount, 5)}% 절약` : `정가 대비 최대 ${Math.max(discount, 5)}% 절약`}</p>
              </div>
            </div>
            {/* 포인트 적립 */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#16A34A" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-9 mb-[4px]">스마트홈딜 포인트</p>
                <p className="text-[12px] text-gray-6 leading-snug">구매금액의 1% 포인트 적립<br />다음 구매 시 현금처럼 사용</p>
              </div>
            </div>
            {/* 보증/AS */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-gray-2 border border-gray-3 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#1C1C1E" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                {isApple ? (
                  <>
                    <p className="text-[14px] font-bold text-gray-9 mb-[4px]">AppleCare+ 동시 구매</p>
                    <p className="text-[12px] text-gray-6 leading-snug">구매 시 AppleCare+ 함께 신청 가능<br />파손 수리 횟수 제한 없이 보장</p>
                  </>
                ) : (
                  <>
                    <p className="text-[14px] font-bold text-gray-9 mb-[4px]">제조사 공식 A/S</p>
                    <p className="text-[12px] text-gray-6 leading-snug">제조사 1년 보증 포함<br />전국 공식 서비스 센터 이용 가능</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 성능 시각화 섹션 */}
        {(product.productCategoryKey === 'macbook_pro_14' || product.productCategoryKey === 'macbook_pro_16' || product.productCategoryKey === 'mac_studio' || product.productCategoryKey === 'mac_mini') && (
          <div className="mb-[32px]">
            <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
              <span className="w-[4px] h-[18px] bg-purple-500 rounded-full inline-block" />
              성능 벤치마크
            </h3>
            <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px] lg:p-[24px]">
              <p className="text-[12px] text-gray-5 mb-[20px]">이전 세대(Intel) 동급 제품 대비</p>
              <div className="flex flex-col gap-[16px]">
                {[
                  { label: 'CPU 성능', intel: 62, apple: 100, desc: '최대 4.5배' },
                  { label: 'GPU 성능', intel: 48, apple: 100, desc: '최대 5.2배' },
                  { label: '배터리 효율', intel: 55, apple: 100, desc: '최대 2.4배' },
                  { label: 'Neural Engine (AI)', intel: 10, apple: 100, desc: '최대 38배' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-[6px]">
                      <span className="text-[13px] font-semibold text-gray-9">{item.label}</span>
                      <span className="text-[12px] font-bold text-purple-600">{item.desc}</span>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[10px] text-gray-5 w-[38px] shrink-0">이전 세대</span>
                        <div className="flex-1 bg-gray-3 rounded-full h-[8px] overflow-hidden">
                          <div className="h-full bg-gray-5 rounded-full" style={{ width: `${item.intel}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-5 w-[24px] shrink-0 text-right">{item.intel}</span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[10px] text-gray-5 w-[38px] shrink-0">Apple M</span>
                        <div className="flex-1 bg-gray-3 rounded-full h-[8px] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.apple}%`, background: 'linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)' }} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 w-[24px] shrink-0 text-right">{item.apple}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-[16px] text-[11px] text-gray-5">* Geekbench 6 / Cinebench R23 기반 상대 비교 (100점 만점 기준)</p>
            </div>
          </div>
        )}

        {/* 구성품 */}
        <div className="mb-[32px]">
          <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
            <span className="w-[4px] h-[18px] bg-blue-7 rounded-full inline-block" />
            구성품
          </h3>
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <ul className="grid grid-cols-2 gap-[10px] lg:grid-cols-3">
              {(isApple
                ? (product.productCategoryKey === 'macbook_pro_14' || product.productCategoryKey === 'macbook_pro_16'
                  ? ['MacBook Pro 본체', 'MagSafe 3 충전 케이블 (2m)', 'USB-C to MagSafe 3 케이블', '140W USB-C 전원 어댑터', '빠른 시작 안내서']
                  : product.productCategoryKey === 'mac_studio'
                  ? ['Mac Studio 본체', 'USB-C to MagSafe 3 케이블 (1m)', '전원 케이블', '빠른 시작 안내서']
                  : product.productCategoryKey === 'mac_pro'
                  ? ['Mac Pro 본체', '전원 케이블', 'Magic Keyboard (Touch ID)', 'Magic Mouse', 'USB-C 충전 케이블']
                  : ['Mac mini 본체', '전원 케이블', '빠른 시작 안내서'])
                : product.productCategoryKey === 'cordless_vacuum_cleaner'
                ? ['본체', '흡입구 (대/소)', '충전 거치대', '충전 어댑터', '빠른 시작 안내서']
                : product.productCategoryKey === 'robotic_vacuum_cleaner'
                ? ['로봇청소기 본체', '자동 충전 스테이션', '전원 케이블', '사이드 브러시 × 2', '빠른 시작 안내서']
                : product.productCategoryKey === 'air_purifier'
                ? ['본체', '필터 (사전 설치)', '전원 케이블', '빠른 시작 안내서']
                : product.productCategoryKey === 'dish_washer'
                ? ['본체', '급수 호스', '배수 호스', '식기 바구니', '빠른 시작 안내서']
                : product.productCategoryKey === 'coffee_maker'
                ? ['본체', '물통', '포터필터', '탬퍼', '스팀 노즐', '빠른 시작 안내서']
                : product.productCategoryKey === 'blender'
                ? ['핸드블렌더 본체', '블렌딩 샤프트', '계량컵', '빠른 시작 안내서']
                : product.productCategoryKey === 'steam_iron'
                ? ['다리미 본체', '빠른 시작 안내서']
                : product.productCategoryKey === 'smart_watch'
                ? ['스마트워치 본체', '충전 케이블', '여분 스트랩', '빠른 시작 안내서']
                : product.productCategoryKey === 'bluetooth_earphone'
                ? ['이어폰 (좌/우)', '충전 케이스', 'USB-C 충전 케이블', '이어팁 (S/M/L)', '빠른 시작 안내서']
                : product.productCategoryKey === 'tv'
                ? ['TV 본체', '스탠드', '리모컨', '전원 케이블', '빠른 시작 안내서']
                : product.productCategoryKey === 'electric_rice_cooker'
                ? ['본체', '내솥', '전원 케이블', '밥주걱', '빠른 시작 안내서']
                : ['본체', '전원 케이블', '빠른 시작 안내서']
              ).map((item, i) => (
                <li key={i} className="flex items-center gap-[8px]">
                  <svg className="w-[14px] h-[14px] text-blue-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-[13px] text-gray-9">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 제품 사양 섹션 */}
      <div ref={specRef} id="section-spec" className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[24px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">제품 사양</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-3">
          <table className="w-full text-[14px]">
            <tbody>
              {Object.entries(specs).map(([key, val], i) => (
                <tr key={key} className={i % 2 === 0 ? 'bg-gray-1' : 'bg-white'}>
                  <td className="px-[16px] py-[13px] font-semibold text-gray-7 w-[130px] lg:w-[180px] align-top border-r border-gray-3">
                    {key}
                  </td>
                  <td className="px-[16px] py-[13px] text-gray-10">
                    {val}
                  </td>
                </tr>
              ))}
              {isApple ? (
                <>
                  <tr className="bg-gray-1">
                    <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">운영체제</td>
                    <td className="px-[16px] py-[13px] text-gray-10">macOS Sequoia (최신 버전)</td>
                  </tr>
                  <tr>
                    <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">보증</td>
                    <td className="px-[16px] py-[13px] text-gray-10">Apple 1년 제한 보증 포함 (AppleCare+ 별도 구매 가능)</td>
                  </tr>
                  <tr className="bg-gray-1">
                    <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">정품 여부</td>
                    <td className="px-[16px] py-[13px] text-gray-10 font-medium text-green-600">Apple Korea 정품 (한국 공식 유통 제품)</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="bg-gray-1">
                    <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">브랜드</td>
                    <td className="px-[16px] py-[13px] text-gray-10">{product.brandName}</td>
                  </tr>
                  <tr>
                    <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">보증</td>
                    <td className="px-[16px] py-[13px] text-gray-10">제조사 1년 보증 (서비스센터 이용 가능)</td>
                  </tr>
                  <tr className="bg-gray-1">
                    <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">정품 여부</td>
                    <td className="px-[16px] py-[13px] text-gray-10 font-medium text-green-600">공식 정품 (한국 정식 유통 제품)</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* 사양 안내 */}
        {isApple && (
          <div className="mt-[16px] flex items-center gap-[8px] bg-gray-1 rounded-xl border border-gray-3 p-[14px]">
            <svg className="w-[16px] h-[16px] text-blue-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-[12px] text-gray-7">
              상세 기술 사양은 <span className="font-semibold text-blue-7">apple.com/kr</span>에서 확인하실 수 있습니다.
            </p>
          </div>
        )}
      </div>

      {/* 리뷰 섹션 */}
      <div ref={reviewRef} id="section-review" className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[24px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">
              리뷰
              {product.reviewCnt > 0 && (
                <span className="ml-[6px] text-blue-7">{product.reviewCnt.toLocaleString('ko-KR')}</span>
              )}
            </span>
          </div>
        </div>

        {product.reviewCnt > 0 ? (
          <div>
            {/* 별점 요약 */}
            <div className="bg-gray-1 rounded-2xl border border-gray-3 p-[24px] lg:p-[32px] mb-[24px]">
              <div className="flex flex-col items-center gap-[12px] sm:flex-row sm:gap-[32px]">
                <div className="text-center">
                  <p className="text-[56px] font-extrabold text-gray-10 leading-none">{product.reviewAvg.toFixed(1)}</p>
                  <div className="mt-[10px] flex justify-center">
                    <StarRating avg={product.reviewAvg} cnt={product.reviewCnt} />
                  </div>
                  <p className="mt-[6px] text-[13px] text-gray-6">총 {product.reviewCnt.toLocaleString('ko-KR')}개 리뷰</p>
                </div>
                <div className="flex-1 w-full">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === Math.round(product.reviewAvg) ? 65 : star > product.reviewAvg ? Math.max(5, 30 - (star - product.reviewAvg) * 15) : Math.max(5, 20 + (product.reviewAvg - star) * 10);
                    const cappedPct = Math.min(pct, 90);
                    return (
                      <div key={star} className="flex items-center gap-[8px] mb-[6px]">
                        <span className="text-[12px] text-gray-6 w-[12px] text-right shrink-0">{star}</span>
                        <svg className="w-[12px] h-[12px] text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 bg-gray-3 rounded-full h-[6px] overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${cappedPct}%` }} />
                        </div>
                        <span className="text-[11px] text-gray-5 w-[30px] shrink-0">{cappedPct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 샘플 리뷰 카드 */}
            <div className="flex flex-col gap-[12px]">
              {(isApple ? [
                { name: '김**', rating: 5, date: '2026.02.15', text: '정말 최고의 성능입니다. 영상 편집이 이렇게 빠르고 부드럽게 되는건 처음이에요. M 칩 진짜 대단합니다.' },
                { name: '박**', rating: 5, date: '2026.02.08', text: '배터리가 진짜 오래 갑니다. 하루 종일 써도 여유롭네요. 디스플레이도 너무 아름답고요. 가격이 비싸지만 그 이상의 가치가 있습니다.' },
                { name: '이**', rating: 4, date: '2026.01.22', text: '스마트홈딜 공동구매로 정가보다 저렴하게 구입했습니다. 빠른 배송, 정품 확인 완료. 만족합니다!' },
              ] : [
                { name: '김**', rating: 5, date: '2026.02.20', text: `${product.brandName} 제품 쓴지 3개월 됐는데 매우 만족합니다. 생각보다 훨씬 좋아요. 기능도 다양하고 쓰기 편해서 주변에도 추천했습니다.` },
                { name: '최**', rating: 5, date: '2026.02.11', text: '스마트홈딜에서 정가보다 훨씬 저렴하게 샀어요. 배송도 빠르고 정품 확인도 됩니다. 디자인도 깔끔하고 품질도 좋아서 재구매 의향 있습니다.' },
                { name: '박**', rating: 4, date: '2026.01.30', text: '가성비 정말 좋습니다. 이 가격에 이 성능이면 충분히 만족스럽네요. 초기 세팅도 어렵지 않았고 사용하기 편합니다.' },
              ]).map((review, i) => (
                <div key={i} className="bg-gray-1 rounded-xl border border-gray-3 p-[18px]">
                  <div className="flex items-center justify-between mb-[10px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[32px] h-[32px] rounded-full bg-blue-1 flex items-center justify-center">
                        <span className="text-[12px] font-bold text-blue-7">{review.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-9">{review.name}</p>
                        <p className="text-[11px] text-gray-5">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <svg key={j} className="w-[13px] h-[13px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-9 leading-[1.6]">{review.text}</p>
                  <div className="mt-[10px] flex items-center gap-[12px]">
                    <button className="flex items-center gap-[4px] text-[12px] text-gray-6 hover:text-blue-7 transition-colors">
                      <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                      </svg>
                      도움이 됨 (12)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-[16px] text-[12px] text-gray-5 text-center border-t border-gray-3 pt-[16px]">
              실제 구매자 리뷰를 기반으로 집계된 평점입니다.
            </p>
          </div>
        ) : (
          <div className="bg-gray-1 rounded-2xl border border-gray-3 p-[40px] text-center">
            <p className="text-[15px] text-gray-6">아직 등록된 리뷰가 없습니다.</p>
            <p className="mt-[6px] text-[13px] text-gray-5">첫 번째 리뷰를 남겨보세요!</p>
          </div>
        )}
      </div>

      {/* 배송/반품 섹션 */}
      <div ref={shippingRef} id="section-shipping" className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[24px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">배송/반품</span>
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <h3 className="text-[14px] font-bold text-gray-9 mb-[12px] flex items-center gap-[6px]">
              <svg className="w-[16px] h-[16px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              배송 안내
            </h3>
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">배송비</dt>
                <dd className="text-[13px] text-gray-10 font-semibold text-green-600">무료배송</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">출발</dt>
                <dd className="text-[13px] text-gray-10">오늘 오후 2시 이전 주문 시 당일 발송</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">도착</dt>
                <dd className="text-[13px] text-gray-10">평일 기준 익일 도착 예정</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">택배사</dt>
                <dd className="text-[13px] text-gray-10">CJ대한통운 / 로젠택배</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">포장</dt>
                <dd className="text-[13px] text-gray-10">{isApple ? 'Apple 공식 박스 미개봉 상태 밀봉 배송' : '제조사 정품 박스 미개봉 상태 밀봉 배송'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <h3 className="text-[14px] font-bold text-gray-9 mb-[12px] flex items-center gap-[6px]">
              <svg className="w-[16px] h-[16px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              반품/교환 안내
            </h3>
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">기간</dt>
                <dd className="text-[13px] text-gray-10">수령 후 7일 이내</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">반품비</dt>
                <dd className="text-[13px] text-gray-10">무료 (단순 변심 제외 — 왕복 배송비 소비자 부담)</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">불가사유</dt>
                <dd className="text-[13px] text-gray-10">사용 후, 박스 개봉 후 구성품 설치/등록, 스크래치/흠집 발생 시</dd>
              </div>
            </dl>
          </div>

          {/* AS 안내 */}
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <h3 className="text-[14px] font-bold text-gray-9 mb-[12px] flex items-center gap-[6px]">
              <svg className="w-[16px] h-[16px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
              {isApple ? 'Apple 공식 보증 안내' : '보증 / A/S 안내'}
            </h3>
            {isApple ? (
              <dl className="flex flex-col gap-[8px]">
                <div className="flex gap-[16px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">기본 보증</dt>
                  <dd className="text-[13px] text-gray-10">Apple 1년 제한 보증</dd>
                </div>
                <div className="flex gap-[16px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">Apple AS</dt>
                  <dd className="text-[13px] text-gray-10">전국 Apple 공인 서비스 센터 이용 가능</dd>
                </div>
                <div className="flex gap-[16px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">추가 보증</dt>
                  <dd className="text-[13px] text-gray-10">AppleCare+ 가입 시 2년 연장 (별도 구매)</dd>
                </div>
              </dl>
            ) : (
              <dl className="flex flex-col gap-[8px]">
                <div className="flex gap-[16px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">기본 보증</dt>
                  <dd className="text-[13px] text-gray-10">제조사 1년 보증</dd>
                </div>
                <div className="flex gap-[16px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">서비스</dt>
                  <dd className="text-[13px] text-gray-10">전국 공식 서비스 센터 이용 가능</dd>
                </div>
                <div className="flex gap-[16px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">문의</dt>
                  <dd className="text-[13px] text-gray-10">스마트홈딜 고객센터 운영시간 내 접수 가능</dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
