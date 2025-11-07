import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
    interface User extends DefaultUser {
        role?: string
    }

    interface Session {
        user: {
            id?: string
            name?: string | null
            email?: string | null
            role?: string
        } & DefaultSession['user']
    }

    interface JWT {
        role?: string
    }
}
