import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
    sessionToken: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expires: { type: Date, required: true },
})

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema)