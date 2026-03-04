"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      router.push("/store");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[12px]">
      <div className="mb-[20px]">
        <h2 className="text-[22px] font-extrabold text-white tracking-tight">로그인</h2>
        <p className="text-[13px] text-white/45 mt-[4px]">스마트홈딜에 오신 것을 환영합니다</p>
      </div>

      <input
        type="text"
        placeholder="이메일"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="h-[50px] w-full rounded-[10px] border border-white/15 bg-white/8 px-[16px] text-[15px] text-white placeholder:text-white/35 outline-none focus:border-blue-5 focus:bg-white/12 transition-all"
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-[50px] w-full rounded-[10px] border border-white/15 bg-white/8 px-[16px] text-[15px] text-white placeholder:text-white/35 outline-none focus:border-blue-5 focus:bg-white/12 transition-all"
        required
      />

      {error && (
        <p className="text-[13px] text-red-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-[50px] w-full rounded-[10px] bg-blue-7 hover:bg-blue-6 text-[16px] font-bold text-white disabled:opacity-50 transition-colors"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <div className="pt-[4px] text-center">
        <span className="text-[13px] text-white/45">계정이 없으신가요? </span>
        <Link href="/signup" className="text-[13px] font-bold text-white/80 hover:text-white underline underline-offset-2 transition-colors">
          회원가입
        </Link>
      </div>
    </form>
  );
}
