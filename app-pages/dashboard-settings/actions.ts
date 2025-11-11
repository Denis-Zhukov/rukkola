'use server'

import {connectToDatabase} from '@/lib/mongoose'
import {User} from '@/models/user'
import bcrypt from 'bcryptjs';
import {revalidatePath} from 'next/cache'

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
