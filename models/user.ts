import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
    email: string
    password: string
    name?: string
    role?: 'admin' | 'user'
    emailVerified?: Date
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    emailVerified: { type: Date },
})

export const getUserModel = (): Model<IUser> => {
    if (mongoose.models.User) {
        return mongoose.models.User as Model<IUser>
    }
    return mongoose.model<IUser>('User', UserSchema)
}