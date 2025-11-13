'use server'

import {Lunch} from '@/models/lunch'
import {revalidatePath} from "next/cache";
import {connectToDatabase} from "@/lib/mongoose";

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