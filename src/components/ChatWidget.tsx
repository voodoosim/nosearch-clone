"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: number;
  text: string;
  from: "user" | "agent";
  time: string;
}

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:8002";
const CHAT_WS = process.env.NEXT_PUBLIC_CHAT_WS || "ws://localhost:8002";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // WebSocket 연결
  const connectWs = useCallback((sid: string) => {
    const ws = new WebSocket(`${CHAT_WS}/ws/chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "join", session_id: sid }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "joined") {
        setIsConnected(true);
      } else if (data.action === "reply") {
        setMessages((prev) => [
          ...prev,
          {
            id: ++msgIdRef.current,
            text: data.text,
            from: "agent",
            time: data.time,
          },
        ]);
      } else if (data.action === "sent") {
        // 전송 확인 — 이미 로컬에 추가됨
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };
  }, []);

  // 채팅 시작
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
        setMessages([
          {
            id: ++msgIdRef.current,
            text: data.message || "상담이 시작되었습니다.",
            from: "agent",
            time: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch {
      setMessages([
        {
          id: ++msgIdRef.current,
          text: "연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          from: "agent",
          time: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsStarting(false);
    }
  };

  // 메시지 전송
  const sendMessage = () => {
    const text = input.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return;

    wsRef.current.send(JSON.stringify({ action: "message", text }));
    setMessages((prev) => [
      ...prev,
      {
        id: ++msgIdRef.current,
        text,
        from: "user",
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  // 열기/닫기
  const toggleChat = () => {
    if (!isOpen && !sessionId) {
      setIsOpen(true);
      startChat();
    } else {
      setIsOpen(!isOpen);
    }
  };

  // 닫기 시 WS 정리
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <>
      {/* 채팅 버튼 */}
      <button
        onClick={toggleChat}
        className="fixed bottom-[20px] right-[20px] z-50 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-blue-7 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="실시간 상담"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-[88px] right-[20px] z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-[16px] border border-gray-3 bg-white shadow-2xl">
          {/* 헤더 */}
          <div className="flex items-center gap-[10px] bg-blue-7 px-[16px] py-[14px]">
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">
                스마트홈딜 상담
              </p>
              <p className="text-[11px] text-white/70">
                {isConnected ? "연결됨" : "연결 중..."}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-[12px] py-[12px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-[10px] flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[240px] rounded-[12px] px-[12px] py-[8px] text-[13px] leading-[20px] ${
                    msg.from === "user"
                      ? "bg-blue-7 text-white"
                      : "bg-gray-1 text-gray-10"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p
                    className={`mt-[4px] text-[10px] ${msg.from === "user" ? "text-white/60" : "text-gray-5"}`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-gray-2 px-[12px] py-[10px]">
            <div className="flex items-center gap-[8px]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="메시지를 입력하세요..."
                className="flex-1 rounded-[8px] border border-gray-3 bg-gray-1 px-[12px] py-[10px] text-[13px] text-gray-10 outline-none focus:border-blue-7"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !input.trim()}
                className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[8px] bg-blue-7 text-white disabled:bg-gray-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
