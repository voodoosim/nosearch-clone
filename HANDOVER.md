# HANDOVER.md — 스마트홈딜 (nosearch-clone)

> 세션 시작 시 이 파일부터 읽어라. 컨텍스트 복원 후 TO-DO 1번부터 시작.

---

## 프로젝트 기본 정보

- **로컬 경로**: `~/projects/nosearch-clone/app`
- **VPS**: `ssh smartdeal` (WireGuard 10.0.0.5, 실제 IP 45.77.244.130)
- **도메인**: 스마트홈딜.com (Cloudflare SSL Full)
- **GitHub**: voodoosim/nosearch-clone
- **스택**: Next.js 16 + Tailwind v4 + NextAuth v5 + PocketBase auth
- **배포**: `ssh smartdeal "cd /root/nosearch-clone && docker-compose down && docker-compose up -d --build"`
- **PocketBase**: 메인VPS 10.0.0.1:8090 (WireGuard 내부망)
- **Smartdeal-bot WebSocket**: 10.0.0.1:8002 (포인트 API도 여기)

---

## 현재 구현 완료 상태 (2026-03-07 기준)

### 완료된 기능

#### 전역 컴포넌트
- [x] `WishlistProvider` — localStorage 기반 찜 상태 전역 관리
- [x] `RecentlyViewedProvider` — 최근 본 상품 전역 관리
- [x] `CartProvider` — 장바구니 전역 관리
- [x] `Header.tsx` — 찜 하트 아이콘 + 배지 (wishlistCount)
- [x] `MobileBottomNav.tsx` — 홈/스토어/찜/고객센터/마이페이지 탭 + 찜 배지

#### 스토어 홈 (`/store`)
- [x] 타임딜 미니 섹션 ("오늘 자정까지" 빨간 띠 + 4개 상품)
- [x] 기획전/렌탈 2열 다크 배너

#### 상품 상세 (`/store/product/[id]`)
- [x] `WishlistButton.tsx` — 찜/해제 토글 버튼
- [x] 관련 상품 섹션 (같은 카테고리 최대 6개)
- [x] `TrackRecentlyViewed` — 상세 페이지 접근 시 자동 기록

#### 기획전 (`/store/exhibition`)
- [x] `ExhibitionSectionClient.tsx` — 초기 4개 표시 + 더보기/접기 토글

#### 콘텐츠 상세 (`/store/contents/[id]`)
- [x] 실제 본문 렌더링 (인용구, 체크포인트 5개, 이미지 플레이스홀더, 태그)

#### 마이페이지 (`/mypage`)
- [x] 찜 목록 빨간 배지 (wishlistCount)
- [x] 최근 본 상품 회색 배지 (recentItems.length)
- [x] 포인트 카드 + 내역보기 (smartdeal-bot API 연동)

#### 소트 기능
- [x] 상품 목록 정렬 (최신순/가격순/인기순)

#### 결제 플로우 (2026-03-07)
- [x] `/store/cart` — 결제하기 클릭 → 선택상품 localStorage 저장 → `/mypage` 이동
- [x] `/mypage` — 결제 대기 배너 + `결제 요청하기` 버튼 → `/api/order-request` 호출
- [x] `/api/order-request` — smartdeal-bot `/api/order/notify` 호출 → 텔레그램 토픽 알림
- [x] `smartdeal-bot /api/order/notify` — 고객 토픽 찾아서 주문 내용 + 처리 안내 전송

#### 마이페이지 전체 페이지 (완료됨)
- [x] `/mypage/wishlist`, `/mypage/recent`, `/mypage/orders` (더미)
- [x] `/mypage/inquiry`, `/mypage/notice`, `/mypage/settings`

#### 스토어 페이지 (완료됨)
- [x] `/store/cart`, `/store/search`, `/store/rental`, `/store/recommendation`
- [x] `/store/exhibition`, `/store/timedeal`, `/store/deal`, `/store/best`

---

## TO-DO (다음 세션)

### [P1] 결제 플로우 완성
- [ ] **결제 수동 처리 UX**: 직원이 텔레그램에서 확인 후 고객에게 안내 → 현금/계좌이체 처리
- [ ] **주문내역 실제 연동**: orders 페이지 더미 → DB 연동 (주문 생성/조회)

### [P2] 어드민
- [ ] **어드민 페이지** (웹과 별도) — 주문 목록, 결제 처리 상태, 고객 관리

### [P3] 나중에
- [ ] 리뷰 시스템 (상품 상세 탭 → 실제 리뷰 CRUD)
- [ ] 자동 결제 연동 (현재는 수동 처리)

---

## 주요 데이터 파일

```
src/data/
  products-deal.json     # 딜 상품
  products-best.json     # 베스트 상품
  products-timedeal.json # 타임딜 상품
  contents.json          # 가이드 콘텐츠
  exhibitions.json       # 기획전 데이터
  rentals.json           # 렌탈 데이터 (있는지 확인 필요)
```

## 자주 쓰는 명령어

```bash
# 로컬 개발 서버
cd ~/projects/nosearch-clone/app && npm run dev

# 타입 체크
npx tsc --noEmit

# VPS 배포
ssh smartdeal "cd /root/nosearch-clone && git pull origin main && docker-compose down && docker-compose up -d --build"

# VPS 로그
ssh smartdeal "docker logs nosearch-clone_app_1 -f --tail=50"
```

---

## 알려진 이슈 / 주의사항

- `docker-compose down && up` 필수 (down 없이 up만 하면 ContainerConfig 버그)
- `[id]` 경로 git add 시 zsh glob 확장 오류 → 따옴표 사용: `git add 'src/app/store/product/[id]/page.tsx'`
- VPS 배포 전 반드시 `git pull origin main` 선행 (캐시 빌드 방지)

---

_마지막 업데이트: 2026-03-07_
