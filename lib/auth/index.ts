import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../mongoose";
import { User } from "@/models/user";
import type { IUser } from "@/models/user";

export const authConfig = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                login: { label: "Логин", type: "text" },
                password: { label: "Пароль", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();

                if (!credentials?.login || !credentials?.password) return null;

                const user = (await User.findOne({
                    email: credentials.login, // если логин = email
                }).exec()) as IUser | null;

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    String(credentials.password),
                    String(user.password)
                );
                if (!isValid) return null;

                return {
                    id: (user._id as object).toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as IUser).role;
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies import("next-auth").NextAuthConfig;

const handler = NextAuth(authConfig);

export const { handlers, auth, signIn, signOut } = handler;