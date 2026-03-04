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
        const { identifier, password } = credentials as {
          identifier: string;
          password: string;
        };

        if (!identifier || !password) return null;

        try {
          const pb = createPB();
          const authData = await pb.collection('users').authWithPassword(
            identifier,
            password,
          );

          return {
            id: authData.record.id,
            name: authData.record['name'] as string || '',
            email: authData.record.email || '',
          };
        } catch {
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
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
