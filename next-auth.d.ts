import {DefaultSession, DefaultUser} from 'next-auth'

declare module 'next-auth' {
    interface User extends DefaultUser {
        id: string;
        name: string
        surname?: string
        patronymic?: string
        role?: string
    }

    interface Session {
        user: {
            id?: string
            name: string
            surname?: string
            patronymic?: string
            role?: string
        } & DefaultSession['user']
    }

    interface JWT {
        role?: string
    }
}
