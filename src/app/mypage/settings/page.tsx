'use client';

import { useState } from 'react';

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-blue-7' : 'bg-gray-3'
      }`}
    >
      <span
        className={`inline-block h-[22px] w-[22px] translate-y-[2px] rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold text-gray-5 uppercase tracking-wider mb-[4px] px-[4px]">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const [orderNotif, setOrderNotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="mx-auto max-w-[600px] px-[20px] py-[24px] pb-[100px] lg:py-[40px] lg:pb-[60px]">
      <h1 className="text-[20px] font-extrabold text-gray-10 mb-[28px]">설정</h1>

      {/* 인라인 토스트 */}
      {toastMsg && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-50 bg-gray-9 text-white text-[13px] px-[16px] py-[10px] rounded-[8px] shadow-lg pointer-events-none">
          {toastMsg}
        </div>
      )}

      {/* 섹션 1: 알림 설정 */}
      <SectionTitle>알림 설정</SectionTitle>
      <div className="border border-gray-3 rounded-[12px] overflow-hidden bg-gray-1">
        <div className="flex items-center justify-between px-[18px] min-h-[56px] border-b border-gray-3">
          <div>
            <p className="text-[14px] font-medium text-gray-10">주문 / 배송 알림</p>
            <p className="text-[12px] text-gray-5 mt-[2px]">주문 확인, 배송 상태 변경 시 알림</p>
          </div>
          <ToggleSwitch checked={orderNotif} onChange={setOrderNotif} />
        </div>
        <div className="flex items-center justify-between px-[18px] min-h-[56px]">
          <div>
            <p className="text-[14px] font-medium text-gray-10">마케팅 알림</p>
            <p className="text-[12px] text-gray-5 mt-[2px]">할인, 이벤트, 신상품 소식</p>
          </div>
          <ToggleSwitch checked={marketingNotif} onChange={setMarketingNotif} />
        </div>
      </div>

      <div className="border-t border-gray-3 my-[24px]" />

      {/* 섹션 2: 계정 */}
      <SectionTitle>계정</SectionTitle>
      <div className="border border-gray-3 rounded-[12px] overflow-hidden bg-gray-1">
        <button
          type="button"
          className="w-full flex items-center justify-between px-[18px] min-h-[52px] border-b border-gray-3 hover:bg-gray-2 transition-colors active:bg-gray-2"
          onClick={() => showToast('준비 중입니다.')}
        >
          <p className="text-[14px] font-medium text-gray-10">비밀번호 변경</p>
          <svg
            className="w-[16px] h-[16px] text-gray-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-between px-[18px] min-h-[52px] hover:bg-gray-2 transition-colors active:bg-gray-2"
          onClick={() => showToast('준비 중입니다.')}
        >
          <p className="text-[14px] font-medium text-gray-10">알림 수신 설정</p>
          <svg
            className="w-[16px] h-[16px] text-gray-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="border-t border-gray-3 my-[24px]" />

      {/* 회원 탈퇴 */}
      <div className="border border-gray-3 rounded-[12px] overflow-hidden bg-gray-1">
        <button
          type="button"
          className="w-full flex items-center px-[18px] min-h-[52px] hover:bg-gray-2 transition-colors active:bg-gray-2"
          onClick={() => showToast('준비 중입니다.')}
        >
          <p className="text-[14px] font-medium text-red-5">회원 탈퇴</p>
        </button>
      </div>
    </div>
  );
}
