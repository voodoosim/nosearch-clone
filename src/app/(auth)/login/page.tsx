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
      <input
        type="text"
        placeholder="이메일"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="h-[50px] w-full rounded-[8px] border border-white/20 bg-white/10 px-[16px] text-[16px] text-white placeholder:text-white/40 outline-none focus:border-blue-5"
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-[50px] w-full rounded-[8px] border border-white/20 bg-white/10 px-[16px] text-[16px] text-white placeholder:text-white/40 outline-none focus:border-blue-5"
        required
      />

      {error && (
        <p className="text-[13px] text-red-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-[50px] w-full rounded-[8px] bg-blue-7 text-[18px] font-bold text-white disabled:opacity-50"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <div className="pt-[16px] text-center">
        <span className="text-[14px] text-white/60">계정이 없으신가요? </span>
        <Link href="/signup" className="text-[14px] font-bold text-white underline">
          회원가입
        </Link>
      </div>
    </form>
  );
}
