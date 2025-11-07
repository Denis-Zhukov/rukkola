import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    email: string
    password: string
    name?: string
    role?: 'admin'
    emailVerified?: Date
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: String,
    role: { type: String, enum: ['admin'], default: 'admin' },
    emailVerified: Date,
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
