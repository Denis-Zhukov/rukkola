import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongoose'
import { User } from '@/models/user'
import { mongooseAdapter } from './adapter'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: mongooseAdapter,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                await connectToDatabase()
                const user = await User.findOne({ email: credentials.email })
                if (!user) return null

                const isValid = await bcrypt.compare(credentials.password as string, user.password)
                if (!isValid) return null

                return {
                    id: (user._id as object).toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub) session.user.id = token.sub
            if (token.role) session.user.role = token.role as string
            return session
        },
    },
})