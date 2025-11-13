'use server';

import {connectToDatabase} from "@/lib/mongoose";
import {User, UserType} from '@/models/user'

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
