'use client';

import { useState } from 'react';

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  important: boolean;
  content: string;
}

const NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: '스마트홈딜 서비스 개편 안내',
    date: '2026.03.01',
    important: true,
    content:
      '스마트홈딜 서비스 이용에 감사드립니다. 2026년 3월부터 스토어 UI가 전면 개편됩니다. 더욱 편리하고 빠른 쇼핑 경험을 위해 상품 탐색, 결제, 마이페이지 기능이 대폭 개선됩니다. 이용에 불편을 드려 죄송하며, 더 나은 서비스로 보답하겠습니다.',
  },
  {
    id: 2,
    title: '개인정보처리방침 변경 안내 (2026.02.15)',
    date: '2026.02.10',
    important: true,
    content:
      '스마트홈딜 서비스 이용에 감사드립니다. 개인정보보호법 개정에 따라 2026년 2월 15일부터 개인정보처리방침이 일부 변경됩니다. 변경된 주요 내용은 수집 항목 명확화 및 보유 기간 단축입니다. 자세한 내용은 서비스 내 개인정보처리방침 전문을 확인해 주세요.',
  },
  {
    id: 3,
    title: '설 연휴 배송 지연 안내',
    date: '2026.01.25',
    important: false,
    content:
      '스마트홈딜 서비스 이용에 감사드립니다. 설 연휴(1월 28일 ~ 2월 2일) 기간 동안 택배사 운영 중단으로 인해 배송이 지연될 수 있습니다. 연휴 전 주문 건은 1월 27일까지 출고되며, 이후 주문은 2월 3일부터 순차 출고됩니다. 고객 여러분의 양해를 부탁드립니다.',
  },
  {
    id: 4,
    title: '포인트 적립 정책 변경 안내',
    date: '2026.01.10',
    important: false,
    content:
      '스마트홈딜 서비스 이용에 감사드립니다. 2026년 2월 1일부터 포인트 적립 정책이 변경됩니다. 기존 구매 금액의 1% 적립에서 2%로 상향 조정되며, 리뷰 작성 시 추가 포인트가 지급됩니다. 더 많은 혜택을 누리세요.',
  },
  {
    id: 5,
    title: '앱 업데이트 안내 (v2.1.0)',
    date: '2025.12.20',
    important: false,
    content:
      '스마트홈딜 서비스 이용에 감사드립니다. 최신 버전(v2.1.0)이 출시되었습니다. 주요 변경 사항: 다크모드 지원, 상품 비교 기능 추가, 결제 속도 개선, 소소한 버그 수정. 앱스토어 및 플레이스토어에서 업데이트해 주세요.',
  },
];

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-[18px] h-[18px] text-gray-5 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function NoticePage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-[600px] px-[20px] py-[24px] pb-[100px] lg:py-[40px] lg:pb-[60px]">
      <h1 className="text-[20px] font-extrabold text-gray-10 mb-[24px]">공지사항</h1>

      <div className="border border-gray-3 rounded-[12px] overflow-hidden bg-gray-1">
        {NOTICES.map((notice, idx) => (
          <div key={notice.id} className={idx < NOTICES.length - 1 ? 'border-b border-gray-3' : ''}>
            <button
              onClick={() => toggle(notice.id)}
              className="w-full flex items-start gap-[10px] px-[18px] py-[16px] text-left hover:bg-gray-2 transition-colors active:bg-gray-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px] mb-[4px] flex-wrap">
                  {notice.important && (
                    <span className="inline-block px-[7px] py-[2px] text-[11px] font-bold bg-blue-7 text-white rounded-full shrink-0">
                      중요
                    </span>
                  )}
                  <p
                    className={`text-[14px] font-medium leading-[1.4] ${
                      notice.important ? 'text-gray-10' : 'text-gray-9'
                    }`}
                  >
                    {notice.title}
                  </p>
                </div>
                <p className="text-[12px] text-gray-5">{notice.date}</p>
              </div>
              <ChevronDown open={openId === notice.id} />
            </button>

            {openId === notice.id && (
              <div className="px-[18px] pb-[18px] pt-[4px] bg-gray-1">
                <p className="text-[13px] leading-[1.7] text-gray-7">{notice.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
