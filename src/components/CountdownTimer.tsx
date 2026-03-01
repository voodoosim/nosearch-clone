"use client";

import { useState, useEffect } from "react";

function getTimeLeft(endDate: string) {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  if (days > 0) {
    return `${days}일 ${hh}:${mm} 남았어요!`;
  }
  return `${hh}:${mm} 남았어요!`;
}

export default function CountdownTimer({ endDate }: { endDate: string }) {
  const [text, setText] = useState("공동구매 진행중!");

  useEffect(() => {
    const update = () => {
      const left = getTimeLeft(endDate);
      setText(left || "공동구매 종료");
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  return <>{text}</>;
}
