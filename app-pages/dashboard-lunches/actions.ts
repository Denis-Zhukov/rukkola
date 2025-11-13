'use server'

import {Lunch} from '@/models/lunch'
import {revalidatePath} from "next/cache";
import {connectToDatabase} from "@/lib/mongoose";
import fs from "fs";
import path from "path";

export const getAllLunches = async () => {
    await connectToDatabase();

    const lunches = await Lunch.find().sort({createdAt: -1}).lean()
    return JSON.parse(JSON.stringify(lunches))
}

export async function toggleActiveLunch(id: string) {
    await connectToDatabase()

    const lunch = await Lunch.findById(id)
    if (!lunch) return

    if (lunch.active) {
        lunch.active = false
        await lunch.save()
    } else {
        await Lunch.updateMany({}, {$set: {active: false}})
        lunch.active = true
        await lunch.save()
    }

    revalidatePath('/')
    revalidatePath('/dashboard/lunches')
}

export async function deleteLunch(id: string) {
    await connectToDatabase()

    const lunch = await Lunch.findById(id)
    if (!lunch) {
        throw new Error('Lunch not found')
    }

    const uploadsDir = path.resolve('uploads')
    const relativeImagePath = lunch.image
        ?.replace(/^\/?api\//, '')
        .replace(/^\/?image\//, '')
        .trim()

    if (relativeImagePath) {
        const fullPath = path.join(uploadsDir, relativeImagePath)

        try {
            await fs.promises.unlink(fullPath)
        } catch (err: any) {
            if (err.code !== 'ENOENT') {
                console.error('Ошибка при удалении файла:', err)
            }
        }
    }

    await Lunch.deleteOne({_id: id})

    revalidatePath('/');

    return {success: true}
}