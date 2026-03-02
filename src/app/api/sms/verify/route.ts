import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { phone, code } = await request.json();

  if (!phone || !code) {
    return NextResponse.json({ error: "전화번호와 인증번호를 입력해주세요." }, { status: 400 });
  }

  const record = await prisma.verificationCode.findFirst({
    where: {
      phone,
      code,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return NextResponse.json({ error: "인증번호가 올바르지 않거나 만료되었습니다." }, { status: 400 });
  }

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return NextResponse.json({ success: true, message: "인증이 완료되었습니다." });
}
