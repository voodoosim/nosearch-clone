# claude_mistakes_memo.md — 실수 메모장

> 작업 중 실수 발생 시 여기 기록. 다음 세션 시작 시 반드시 확인.

---

## 실수 목록

### [2026-03-05] git add zsh glob 확장 오류
- **상황**: `git add src/app/store/product/[id]/page.tsx` 실행 시 zsh가 `[id]`를 glob으로 해석해 에러
- **해결**: 반드시 따옴표로 감싸기 → `git add 'src/app/store/product/[id]/page.tsx'`
- **규칙**: Next.js dynamic route 파일 git add 시 항상 따옴표 사용

### [2026-03-05] VPS 배포 캐시 빌드 문제
- **상황**: `docker-compose up -d --build` 만 실행 시 이전 이미지 캐시 사용 → 코드 변경 미반영
- **해결**: 배포 전 반드시 `git pull origin main` 선행
- **규칙**: VPS 배포 순서 = `git pull` → `docker-compose down` → `docker-compose up -d --build`

### [2026-03-05] 서버 컴포넌트에서 클라이언트 이벤트 사용 불가
- **상황**: `exhibition/page.tsx` (서버 컴포넌트)에서 `useState`, `onClick` 사용 시 빌드 에러
- **해결**: 클라이언트 로직은 `*Client.tsx` 파일로 분리 후 import
- **규칙**: 서버 컴포넌트 = 데이터 fetch만. 인터랙션 → 별도 'use client' 파일로 분리

### [2026-03-05] docker-compose down 없이 up만 실행 시 ContainerConfig 버그
- **상황**: `docker-compose up -d --build`만 실행하면 컨테이너가 이전 설정으로 올라옴
- **해결**: 항상 `docker-compose down && docker-compose up -d --build`
- **규칙**: VPS Docker 재배포 시 down 필수

---

## 코딩 규칙 (프로젝트 고유)

- Tailwind 클래스: `px-[20px]` 형식 사용 (임의값 bracket notation)
- 컴포넌트 경로: `src/components/` (전역), `src/app/[경로]/` (페이지 전용)
- 데이터 파일: `src/data/*.json` — 서버 컴포넌트에서 직접 import
- Provider 패턴: WishlistProvider, CartProvider, RecentlyViewedProvider 모두 `src/components/` 위치

---

_마지막 업데이트: 2026-03-05_
