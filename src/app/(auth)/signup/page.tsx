"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    'h-[50px] w-full rounded-[10px] border border-white/15 bg-white/8 px-[16px] text-[15px] text-white placeholder:text-white/35 outline-none focus:border-blue-5 focus:bg-white/12 transition-all';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        passwordConfirm,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "회원가입에 실패했습니다.");
      setLoading(false);
      return;
    }

    // 자동 로그인
    const result = await signIn("credentials", {
      identifier: email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      // 가입은 성공했으나 자동 로그인 실패 시 로그인 페이지로
      router.push("/login");
    } else {
      router.push("/store");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[12px]">
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        required
      />

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
        required
      />

      <input
        type="password"
        placeholder="비밀번호 (8자 이상)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
        required
        minLength={8}
      />

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        className={inputClass}
        required
      />

      {error && <p className="text-[13px] text-red-4">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="h-[50px] w-full rounded-[10px] bg-blue-7 hover:bg-blue-6 text-[16px] font-bold text-white disabled:opacity-50 transition-colors"
      >
        {loading ? "가입 중..." : "가입하기"}
      </button>

      <div className="pt-[16px] text-center">
        <span className="text-[14px] text-white/60">이미 계정이 있으신가요? </span>
        <Link href="/login" className="text-[14px] font-bold text-white underline">
          로그인
        </Link>
      </div>
    </form>
  );
}
