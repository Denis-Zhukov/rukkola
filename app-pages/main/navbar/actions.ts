'use server';

import {Category} from "@/models/category";
import {connectToDatabase} from "@/lib/mongoose";

export const getNavItems = async () => {
    await connectToDatabase();
    const items = await Category.find({isMenuItem: true}).sort({order: 1}).lean();

    return items.map(({_id, name}) => ({id: _id.toString(), name}));
}