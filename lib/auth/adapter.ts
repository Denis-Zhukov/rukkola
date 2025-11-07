import { connectToDatabase } from '@/lib/mongoose'
import mongoose from 'mongoose'

export const mongooseAdapter = {
    async createUser(user: any) {
        await connectToDatabase()
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: { type: String, unique: true },
            emailVerified: Date,
            name: String,
            image: String,
        }))
        const doc = await User.create(user)
        return { ...doc.toObject(), id: doc._id.toString() }
    },

    async getUser(id: string) {
        await connectToDatabase()
        const User = mongoose.models.User
        const doc = await User.findById(id)
        if (!doc) return null
        return { ...doc.toObject(), id: doc._id.toString() }
    },

    async getUserByEmail(email: string) {
        await connectToDatabase()
        const User = mongoose.models.User
        const doc = await User.findOne({ email })
        if (!doc) return null
        return { ...doc.toObject(), id: doc._id.toString() }
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
        await connectToDatabase()
        const Account = mongoose.models.Account
        const account = await Account.findOne({ provider, providerAccountId }).populate('user')
        if (!account?.user) return null
        return { ...account.user.toObject(), id: account.user._id.toString() }
    },

    async updateUser(user: any) {
        await connectToDatabase()
        const User = mongoose.models.User
        const doc = await User.findByIdAndUpdate(user.id, user, { new: true })
        return { ...doc.toObject(), id: doc._id.toString() }
    },

    async deleteUser(userId: string) {
        await connectToDatabase()
        const User = mongoose.models.User
        await User.findByIdAndDelete(userId)
    },

    async linkAccount(account: any) {
        await connectToDatabase()
        const Account = mongoose.models.Account || mongoose.model('Account', new mongoose.Schema({
            userId: String,
            provider: String,
            providerAccountId: String,
            refresh_token: String,
            access_token: String,
            expires_at: Number,
            token_type: String,
            scope: String,
            id_token: String,
            session_state: String,
        }))
        const doc = await Account.create(account)
        return doc.toObject()
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
        await connectToDatabase()
        const Account = mongoose.models.Account
        await Account.deleteOne({ provider, providerAccountId })
    },

    async createSession(session: any) {
        await connectToDatabase()
        const Session = mongoose.models.Session || mongoose.model('Session', new mongoose.Schema({
            sessionToken: { type: String, unique: true },
            userId: String,
            expires: Date,
        }))
        const doc = await Session.create(session)
        return doc.toObject()
    },

    async getSessionAndUser(sessionToken: string) {
        await connectToDatabase()
        const Session = mongoose.models.Session
        const session = await Session.findOne({ sessionToken }).populate('userId')
        if (!session || !session.userId) return null

        const user = session.userId
        return {
            session: {
                ...session.toObject(),
                userId: user._id.toString(),
            },
            user: { ...user.toObject(), id: user._id.toString() },
        }
    },

    async updateSession(session: any) {
        await connectToDatabase()
        const Session = mongoose.models.Session
        const doc = await Session.findOneAndUpdate(
            { sessionToken: session.sessionToken },
            session,
            { new: true }
        )
        return doc?.toObject() || null
    },

    async deleteSession(sessionToken: string) {
        await connectToDatabase()
        const Session = mongoose.models.Session
        await Session.deleteOne({ sessionToken })
    },

    // Опционально: verification tokens
    async createVerificationToken(token: any) {
        await connectToDatabase()
        const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', new mongoose.Schema({
            identifier: String,
            token: { type: String, unique: true },
            expires: Date,
        }))
        await VerificationToken.create(token)
        return token
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
        await connectToDatabase()
        const VerificationToken = mongoose.models.VerificationToken
        const doc = await VerificationToken.findOneAndDelete({ identifier, token })
        return doc?.toObject() || null
    },
}