import { NextResponse } from "next/server";
import { createPB } from "@/lib/pocketbase";

export async function POST(request: Request) {
  const { name, email, password, passwordConfirm } = await request.json();

  // 필수 필드 검증
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "이름, 이메일, 비밀번호를 모두 입력해주세요." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 합니다." },
      { status: 400 },
    );
  }

  if (password !== passwordConfirm) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 400 },
    );
  }

  try {
    const pb = createPB();

    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      name,
    });

    // 봇 회원 등록 (포인트 보너스)
    const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API || 'http://localhost:8002';
    try {
      await fetch(`${CHAT_API}/api/member/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
    } catch {
      // 봇 연결 실패해도 가입은 진행
    }

    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      userId: user.id,
    });
  } catch (err: unknown) {
    const pbError = err as { response?: { data?: Record<string, { message?: string }> }; status?: number };

    // PocketBase 에러 처리
    if (pbError.response?.data) {
      const data = pbError.response.data;
      if (data['email']?.message) {
        return NextResponse.json(
          { error: "이미 가입된 이메일입니다." },
          { status: 409 },
        );
      }
    }

    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "회원가입에 실패했습니다." },
      { status: 500 },
    );
  }
}
