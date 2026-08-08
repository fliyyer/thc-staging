import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "public_profile email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "default_nextauth_secret_key_change_in_production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
