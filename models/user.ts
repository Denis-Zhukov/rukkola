import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    username: string
    password: string
    name: string
    surname?: string
    patronymic?: string
    role?: 'admin'
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: String,
    patronymic: String,
    role: { type: String, enum: ['admin', 'moderator'], default: 'moderator' }
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
