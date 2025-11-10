'use server'

import {connectToDatabase} from '@/lib/mongoose'
import {Category} from '@/models/category'
import {revalidatePath} from "next/cache";

export async function toggleCategoryField(id: string, field: 'isMenuItem' | 'showGroupTitle') {
    await connectToDatabase()
    const category = await Category.findById(id)
    if (!category) return

    category[field] = !category[field]
    await category.save()

    revalidatePath('/dashboard/categories');
    revalidatePath('/');
}

export async function moveCategory(id: string, direction: 'up' | 'down') {
    await connectToDatabase()

    const current = await Category.findById(id)
    if (!current) return

    const all = await Category.find().sort({order: 1})
    const index = all.findIndex((c) => c._id.equals(current._id))
    const swapIndex = direction === 'up' ? index - 1 : index + 1

    if (swapIndex < 0 || swapIndex >= all.length) return

    const target = all[swapIndex]

    const temp = current.order
    await Category.updateOne({_id: current._id}, {$set: {order: -1}})

    await Category.updateOne({_id: target._id}, {$set: {order: temp}})
    await Category.updateOne({_id: current._id}, {$set: {order: target.order}})

    revalidatePath('/dashboard/categories');
    revalidatePath('/');
}

export async function updateCategoryName(id: string, name: string) {
    await connectToDatabase()
    const category = await Category.findById(id)
    if (!category) return
    category.name = name
    await category.save()
    revalidatePath('/dashboard/categories');
    revalidatePath('/');
}

export async function deleteCategory(id: string) {
    await connectToDatabase()

    const deleteRecursive = async (categoryId: string) => {
        const children = await Category.find({parent: categoryId})
        for (const child of children) {
            await deleteRecursive(child._id.toString())
        }
        await Category.findByIdAndDelete(categoryId)
    }

    await deleteRecursive(id)
    revalidatePath('/dashboard/categories')
    revalidatePath('/')
}

export async function createCategory({
                                         name,
                                         parentId,
                                         isMenuItem = false,
                                         showGroupTitle = false,
                                     }: {
    name: string
    parentId?: string | null
    isMenuItem?: boolean
    showGroupTitle?: boolean
}) {
    await connectToDatabase()

    const parent = parentId ? parentId : null

    const top = await Category.find().sort({ order: -1 }).limit(1).lean()
    const nextOrder = top && top.length ? top[0].order + 1 : 1

    const cat = new Category({
        name,
        parent: parent,
        order: nextOrder,
        isMenuItem,
        showGroupTitle,
    })

    await cat.save()
    revalidatePath('/dashboard/categories');

    return cat.toObject()
}