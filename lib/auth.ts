import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import Restaurant from '@/models/Restaurant';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await dbConnect();

        const restaurant = await Restaurant.findOne({ adminEmail: credentials.email });
        if (!restaurant) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, restaurant.adminPasswordHash);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: restaurant._id.toString(),
          email: restaurant.adminEmail,
          name: restaurant.name,
          restaurantId: restaurant._id.toString(),
          restaurantSlug: restaurant.slug,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.restaurantId = (user as any).restaurantId;
        token.restaurantSlug = (user as any).restaurantSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).restaurantId = token.restaurantId;
        (session.user as any).restaurantSlug = token.restaurantSlug;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
