'use server';

import {connectToDatabase} from "@/lib/mongoose";
import {User, UserType} from '@/models/user'
import bcrypt from "bcryptjs";

export async function updatePassword(userId: string, oldPassword: string, newPassword: string) {
    await connectToDatabase()

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Пользователь не найден')
    }


    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
        throw new Error('Неверный текущий пароль')
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return {success: true}
}

export async function getUsers() {
    await connectToDatabase();

    return User.find().lean().exec();
}

export async function updateUser(id: string, data: Partial<UserType>) {
    await connectToDatabase();

    return User.findByIdAndUpdate(id, data).lean().exec();
}

export async function deleteUser(id: string) {
    await connectToDatabase();

    return User.findByIdAndDelete(id).lean().exec();
}
