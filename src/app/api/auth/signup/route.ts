import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, birthDate, gender, phone, email, password } = await request.json();

  // 필수 필드 검증
  if (!name || !birthDate || !gender || !phone || !password) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  // 전화번호 인증 확인
  const verified = await prisma.verificationCode.findFirst({
    where: { phone, verified: true },
    orderBy: { createdAt: "desc" },
  });

  if (!verified) {
    return NextResponse.json({ error: "전화번호 인증을 먼저 완료해주세요." }, { status: 400 });
  }

  // 중복 체크
  const existingPhone = await prisma.user.findUnique({ where: { phone } });
  if (existingPhone) {
    return NextResponse.json({ error: "이미 가입된 전화번호입니다." }, { status: 409 });
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
    }
  }

  // 비밀번호 해싱 & 저장
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      birthDate,
      gender,
      phone,
      email: email || null,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    success: true,
    message: "회원가입이 완료되었습니다.",
    userId: user.id,
  });
}
