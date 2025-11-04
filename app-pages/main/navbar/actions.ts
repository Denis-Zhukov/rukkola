'use server';

import {Category} from "@/models/category";

export const getNavItems = async () => {
    const items = await Category.find({isMenuItem: true}).sort({order: 1}).lean();

    return items.map(({_id, name}) => ({id: _id.toString(), name}));
}