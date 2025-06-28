import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth environment variables. Make sure to set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
}

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET environment variable.");
}

const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow admin users to sign in
      if (account?.provider === 'google' && user.email) {
        return adminEmails.includes(user.email);
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = adminEmails.includes(user.email || '');
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin',
    error: '/admin?error=access_denied',
  },
})

export { handler as GET, handler as POST }
