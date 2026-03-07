import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createPB } from "@/lib/pocketbase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "이메일 또는 전화번호" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const { identifier: rawId, password: rawPw } = credentials as {
          identifier: string;
          password: string;
        };
        const identifier = rawId?.trim() ?? '';
        const password = rawPw?.trim() ?? '';

        if (!identifier || !password) return null;

        try {
          const pb = createPB();
          const authData = await pb.collection('users').authWithPassword(
            identifier,
            password,
          );

          const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
          const role = adminEmails.includes(authData.record.email) ? 'admin' : 'user';
          return {
            id: authData.record.id,
            name: authData.record['name'] as string || '',
            email: authData.record.email || '',
            role,
          };
        } catch (e) {
          console.error('[auth] PB 로그인 실패:', e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'user';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  trustHost: true,
});
