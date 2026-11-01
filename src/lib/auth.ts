import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or ID', type: 'text', placeholder: 'admin@school.com or STU-2026-001' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Please enter both your identifier/email and password');
        }

        const input = credentials.identifier.trim();
        const upper = input.toUpperCase();

        // Search by email OR by identifier (with fallback aliases for TCH001, STU001, PAR001, ADMIN001)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: input },
              { identifier: input },
              { identifier: upper },
              { identifier: input.toLowerCase() },
              ...(upper === 'TCH001' ? [{ identifier: 'TCH-001' }] : []),
              ...(upper === 'STU001' ? [{ identifier: 'STU-2026-001' }] : []),
              ...(upper === 'PAR001' ? [{ identifier: 'PRN-001' }] : []),
              ...(upper === 'ADMIN001' ? [{ identifier: 'admin' }] : []),
            ],
          },
          include: {
            studentProfile: {
              include: {
                section: {
                  include: { classLevel: true },
                },
              },
            },
            teacherProfile: true,
            parentProfile: true,
          },
        });

        if (!user) {
          throw new Error('No account found with this identifier/email');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          identifier: user.identifier,
          avatar: user.avatar,
          studentProfileId: user.studentProfile?.id || null,
          sectionId: user.studentProfile?.sectionId || null,
          className: user.studentProfile?.section
            ? `${user.studentProfile.section.classLevel.name} - ${user.studentProfile.section.name}`
            : null,
          teacherProfileId: user.teacherProfile?.id || null,
          parentProfileId: user.parentProfile?.id || null,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.identifier = (user as any).identifier;
        token.avatar = (user as any).avatar;
        token.studentProfileId = (user as any).studentProfileId;
        token.sectionId = (user as any).sectionId;
        token.className = (user as any).className;
        token.teacherProfileId = (user as any).teacherProfileId;
        token.parentProfileId = (user as any).parentProfileId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).identifier = token.identifier;
        (session.user as any).avatar = token.avatar;
        (session.user as any).studentProfileId = token.studentProfileId;
        (session.user as any).sectionId = token.sectionId;
        (session.user as any).className = token.className;
        (session.user as any).teacherProfileId = token.teacherProfileId;
        (session.user as any).parentProfileId = token.parentProfileId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
