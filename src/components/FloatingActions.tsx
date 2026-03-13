"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: number;
  text: string;
  from: "user" | "agent";
  time: string;
}

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:8002";
const CHAT_WS = process.env.NEXT_PUBLIC_CHAT_WS || "ws://localhost:8002";
const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_smarthomdeal";

export default function FloatingActions() {
  const { status: authStatus } = useSession();
  const router = useRouter();

  /* scroll-to-top 가시성 */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 채팅 패널 */
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const connectWs = useCallback((sid: string) => {
    const ws = new WebSocket(`${CHAT_WS}/ws/chat`);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ action: "join", session_id: sid }));
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "joined") setIsConnected(true);
      else if (data.action === "reply") {
        setMessages((prev) => [
          ...prev,
          { id: ++msgIdRef.current, text: data.text, from: "agent", time: data.time },
        ]);
      }
    };
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);
  }, []);

  const startChat = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const res = await fetch(`${CHAT_API}/api/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.session_id) {
        setSessionId(data.session_id);
        connectWs(data.session_id);
        setMessages([{
          id: ++msgIdRef.current,
          text: data.message || "상담이 시작되었습니다.",
          from: "agent",
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        }]);
      }
    } catch {
      setMessages([{
        id: ++msgIdRef.current,
        text: "연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        from: "agent",
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setIsStarting(false);
    }
  };

  const toggleChat = () => {
    if (authStatus !== "authenticated") { router.push("/login"); return; }
    if (!isChatOpen && !sessionId) { setIsChatOpen(true); startChat(); }
    else setIsChatOpen(!isChatOpen);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ action: "message", text }));
    setMessages((prev) => [
      ...prev,
      {
        id: ++msgIdRef.current, text, from: "user",
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  useEffect(() => () => { wsRef.current?.close(); }, []);

  return (
    <>
      {/* ── 플로팅 사이드 버튼 묶음 ── */}
      <div className="fixed bottom-[24px] right-[20px] z-50 flex flex-col items-center gap-[10px]">

        {/* 실시간 상담 */}
        <button
          onClick={toggleChat}
          title="실시간 상담"
          className="group relative flex h-[52px] w-[52px] flex-col items-center justify-center rounded-full bg-blue-7 text-white shadow-[0_4px_16px_rgba(201,162,39,0.4)] transition-all hover:scale-105 hover:shadow-[0_6px_24px_rgba(201,162,39,0.55)] active:scale-95"
        >
          {isChatOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {/* 툴팁 */}
          <span className="pointer-events-none absolute right-[60px] whitespace-nowrap rounded-[8px] bg-gray-1 border border-gray-3 px-[10px] py-[5px] text-[11px] font-semibold text-gray-7 opacity-0 transition-opacity group-hover:opacity-100">
            실시간 상담
          </span>
        </button>

        {/* 카톡 상담 */}
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="카카오톡 상담"
          className="group relative flex h-[52px] w-[52px] flex-col items-center justify-center rounded-full bg-[#FEE500] shadow-[0_4px_14px_rgba(254,229,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_6px_22px_rgba(254,229,0,0.55)] active:scale-95"
        >
          {/* 카카오 말풍선 아이콘 */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="11" rx="9" ry="7.5" fill="#3A1D1D" />
            <path d="M7 15.5l1.5-3.5" stroke="#FEE500" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M9.5 11.5h5M12 9.5v4" stroke="#FEE500" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="pointer-events-none absolute right-[60px] whitespace-nowrap rounded-[8px] bg-gray-1 border border-gray-3 px-[10px] py-[5px] text-[11px] font-semibold text-gray-7 opacity-0 transition-opacity group-hover:opacity-100">
            카톡 상담
          </span>
        </a>

        {/* TOP 버튼 — 스크롤 400px 이상일 때만 */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="맨 위로"
          className={`group relative flex h-[44px] w-[44px] flex-col items-center justify-center rounded-full border border-gray-4 bg-gray-2 text-gray-6 shadow-md transition-all hover:border-blue-7 hover:text-blue-7 active:scale-95 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <span className="pointer-events-none absolute right-[52px] whitespace-nowrap rounded-[8px] bg-gray-1 border border-gray-3 px-[10px] py-[5px] text-[11px] font-semibold text-gray-7 opacity-0 transition-opacity group-hover:opacity-100">
            TOP
          </span>
        </button>
      </div>

      {/* ── 채팅 패널 ── */}
      {isChatOpen && (
        <div className="fixed bottom-[96px] right-[80px] z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-[16px] border border-gray-3 bg-gray-1 shadow-2xl">
          {/* 헤더 */}
          <div className="flex items-center gap-[10px] bg-blue-7 px-[16px] py-[14px]">
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">스마트홈딜 상담</p>
              <p className="text-[11px] text-white/70">{isConnected ? "연결됨" : "연결 중..."}</p>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-[12px] py-[12px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-[10px] flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[240px] rounded-[12px] px-[12px] py-[8px] text-[13px] leading-[20px] ${
                  msg.from === "user" ? "bg-blue-7 text-white" : "bg-gray-2 text-gray-10"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`mt-[4px] text-[10px] ${msg.from === "user" ? "text-white/60" : "text-gray-5"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-gray-3 px-[12px] py-[10px]">
            <div className="flex items-center gap-[8px]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="메시지를 입력하세요..."
                className="flex-1 rounded-[8px] border border-gray-3 bg-gray-2 px-[12px] py-[10px] text-[13px] text-gray-10 outline-none focus:border-blue-7"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !input.trim()}
                className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[8px] bg-blue-7 text-white disabled:bg-gray-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
