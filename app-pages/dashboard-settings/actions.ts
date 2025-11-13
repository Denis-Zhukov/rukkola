'use server';

import { connectToDatabase } from "@/lib/mongoose";
import { User, UserType } from '@/models/user'
import bcrypt from "bcryptjs";

type CreateUserData = {
    username: string
    password: string
    name: string
    surname?: string
    patronymic?: string
    role?: string
}

function serializeUser(user: any): UserType {
    return {
        _id: user._id.toString(),
        username: user.username,
        name: user.name,
        surname: user.surname,
        patronymic: user.patronymic,
        role: user.role,
    } as UserType
}

export async function createUser(data: CreateUserData): Promise<UserType> {
    await connectToDatabase();

    const existing = await User.findOne({ username: data.username })
    if (existing) {
        throw new Error('Пользователь с таким логином уже существует')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newUser = new User({
        username: data.username,
        password: hashedPassword,
        name: data.name,
        surname: data.surname || '',
        patronymic: data.patronymic || '',
        role: data.role || 'moderator',
    })

    await newUser.save()

    return serializeUser(newUser)
}

export async function getUsers() {
    await connectToDatabase();

    const users = await User.find().lean().exec()
    return users.map(serializeUser)
}

export async function updateUser(id: string, data: Partial<UserType>) {
    await connectToDatabase();

    const updated = await User.findByIdAndUpdate(id, data, { new: true }).lean().exec()
    if (!updated) throw new Error('Пользователь не найден')
    return serializeUser(updated)
}

export async function deleteUser(id: string) {
    await connectToDatabase();

    const deleted = await User.findByIdAndDelete(id).lean().exec()
    if (!deleted) throw new Error('Пользователь не найден')
    return serializeUser(deleted)
}

export async function updatePassword(userId: string, oldPassword: string, newPassword: string) {
    await connectToDatabase()

    const user = await User.findById(userId);
    if (!user) throw new Error('Пользователь не найден')

    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) throw new Error('Неверный текущий пароль')

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return { success: true }
}
