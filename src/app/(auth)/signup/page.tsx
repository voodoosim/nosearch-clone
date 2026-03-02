"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 비밀번호
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // YYMMDD
  const [gender, setGender] = useState(""); // 1 or 2
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [smsError, setSmsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

  const inputClass =
    "h-[50px] w-full rounded-[8px] border border-white/20 bg-white/10 px-[16px] text-[15px] text-white placeholder:text-white/40 outline-none focus:border-blue-5";

  const handleSendSms = async () => {
    if (!phone) return;
    setSmsError("");
    setSmsLoading(true);

    const res = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setSmsLoading(false);

    if (!res.ok) {
      setSmsError(data.error || "발송 실패");
      return;
    }
    setSmsSent(true);
  };

  const handleVerifySms = async () => {
    if (!smsCode) return;
    setSmsError("");
    setSmsLoading(true);

    const res = await fetch("/api/sms/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: smsCode }),
    });
    const data = await res.json();
    setSmsLoading(false);

    if (!res.ok) {
      setSmsError(data.error || "인증 실패");
      return;
    }
    setSmsVerified(true);
  };

  const handleNext = () => {
    setError("");
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!/^\d{6}$/.test(birthDate)) {
      setError("생년월일 6자리를 입력해주세요. (예: 900101)");
      return;
    }
    if (!gender) {
      setError("성별을 선택해주세요.");
      return;
    }
    if (!smsVerified) {
      setError("전화번호 인증을 완료해주세요.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
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
        birthDate,
        gender,
        phone,
        email: email || undefined,
        password,
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
      identifier: phone,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
    } else {
      router.push("/store/nosearchDeal");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[12px]">
      {step === 1 ? (
        <>
          {/* 이름 */}
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />

          {/* 생년월일 + 성별 */}
          <div className="flex gap-[8px]">
            <input
              type="text"
              placeholder="생년월일 6자리"
              value={birthDate}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setBirthDate(v);
              }}
              className={`${inputClass} flex-1`}
              maxLength={6}
              inputMode="numeric"
            />
            <span className="flex items-center text-[20px] text-white/40">-</span>
            <div className="flex items-center gap-[4px]">
              <input
                type="text"
                value={gender}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^1234]/g, "").slice(0, 1);
                  setGender(v);
                }}
                className="h-[50px] w-[50px] rounded-[8px] border border-white/20 bg-white/10 text-center text-[18px] text-white outline-none focus:border-blue-5"
                maxLength={1}
                inputMode="numeric"
                placeholder="0"
              />
              <span className="text-[20px] text-white/40">* * * * * *</span>
            </div>
          </div>

          {/* 전화번호 */}
          <div className="flex gap-[8px]">
            <input
              type="text"
              placeholder="전화번호 (- 없이)"
              value={phone}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                setPhone(v);
              }}
              className={`${inputClass} flex-1`}
              maxLength={11}
              inputMode="numeric"
              disabled={smsVerified}
            />
            <button
              type="button"
              onClick={handleSendSms}
              disabled={smsLoading || smsVerified || phone.length < 10}
              className="h-[50px] shrink-0 rounded-[8px] bg-blue-7 px-[16px] text-[14px] font-bold text-white disabled:opacity-50"
            >
              {smsVerified ? "인증완료" : smsSent ? "재발송" : "인증번호"}
            </button>
          </div>

          {/* 인증번호 입력 */}
          {smsSent && !smsVerified && (
            <div className="flex gap-[8px]">
              <input
                type="text"
                placeholder="인증번호 6자리"
                value={smsCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setSmsCode(v);
                }}
                className={`${inputClass} flex-1`}
                maxLength={6}
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={handleVerifySms}
                disabled={smsLoading || smsCode.length !== 6}
                className="h-[50px] shrink-0 rounded-[8px] bg-blue-7 px-[16px] text-[14px] font-bold text-white disabled:opacity-50"
              >
                확인
              </button>
            </div>
          )}
          {smsError && <p className="text-[13px] text-red-4">{smsError}</p>}

          {/* 이메일 (선택) */}
          <input
            type="email"
            placeholder="이메일 (선택)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          {error && <p className="text-[13px] text-red-4">{error}</p>}

          <button
            type="button"
            onClick={handleNext}
            className="h-[50px] w-full rounded-[8px] bg-blue-7 text-[18px] font-bold text-white disabled:opacity-50"
          >
            다음
          </button>
        </>
      ) : (
        <>
          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
            minLength={6}
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

          <div className="flex gap-[8px]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-[50px] flex-1 rounded-[8px] border border-white/20 text-[16px] font-bold text-white"
            >
              이전
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-[50px] flex-[2] rounded-[8px] bg-blue-7 text-[18px] font-bold text-white disabled:opacity-50"
            >
              {loading ? "가입 중..." : "가입하기"}
            </button>
          </div>
        </>
      )}

      <div className="pt-[16px] text-center">
        <span className="text-[14px] text-white/60">이미 계정이 있으신가요? </span>
        <Link href="/login" className="text-[14px] font-bold text-white underline">
          로그인
        </Link>
      </div>
    </form>
  );
}
