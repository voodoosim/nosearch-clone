import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone || !/^01[016789]\d{7,8}$/.test(phone)) {
    return NextResponse.json({ error: "유효하지 않은 전화번호입니다." }, { status: 400 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3분

  await prisma.verificationCode.create({
    data: { phone, code, expiresAt },
  });

  // CoolSMS 발송
  const apiKey = process.env.COOLSMS_API_KEY;
  const apiSecret = process.env.COOLSMS_API_SECRET;
  const sender = process.env.COOLSMS_SENDER;

  if (apiKey && apiSecret && sender) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const coolsms = (await import("coolsms-node-sdk")).default;
      const messageService = new coolsms(apiKey, apiSecret);
      await messageService.sendOne({
        to: phone,
        from: sender,
        text: `[스마트홈딜] 인증번호 ${code}를 입력해주세요.`,
        autoTypeDetect: true,
      } as Parameters<typeof messageService.sendOne>[0]);
    } catch (e) {
      console.error("SMS send error:", e);
      return NextResponse.json({ error: "SMS 발송에 실패했습니다." }, { status: 500 });
    }
  } else {
    // CoolSMS 미설정 시 콘솔에 인증번호 출력 (개발용)
    console.log(`[DEV] 인증번호 for ${phone}: ${code}`);
  }

  return NextResponse.json({ success: true, message: "인증번호가 발송되었습니다." });
}
