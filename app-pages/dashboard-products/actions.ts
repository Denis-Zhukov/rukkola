'use server'

import {connectToDatabase} from '@/lib/mongoose'
import {Product} from '@/models/product'
import {Types} from "mongoose";
import {revalidatePath} from "next/cache";
import {Category} from "@/models/category";
import path from 'path';
import * as fs from 'fs'

export async function getProducts(page: number = 1, limit: number = 10) {
    await connectToDatabase()

    const skip = (page - 1) * limit
    const total = await Product.countDocuments()
    const products = await Product.find()
        .populate('categories')
        .skip(skip)
        .limit(limit)
        .lean()

    return {
        products: JSON.parse(JSON.stringify(products)),
        total,
        totalPages: Math.ceil(total / limit),
    }
}

export async function toggleProductVisibility(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
    }

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    product.hidden = !product.hidden;
    await product.save();

    revalidatePath('/');

    return null;
}

export async function getProductById(id: string) {
    await connectToDatabase()
    const product = await Product.findById(id).populate('categories').lean()
    return JSON.parse(JSON.stringify(product))
}

type UpdateProductDataPayload = {
    name: string;
    description: string;
    prices: { size: string; price: number }[];
    categories: string[];
    hidden: boolean;
};

export async function updateProductData(id: string, data: UpdateProductDataPayload) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    const newObj = {
        ...data,
        image: product.image,
    };

    await Product.findByIdAndUpdate(id, newObj);
    revalidatePath('/');

    return newObj;
}

export async function deleteProduct(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    await connectToDatabase();

    const product = await Product.findById(productId).lean();
    if (!product) {
        throw new Error("Product not found");
    }

    await Product.deleteOne({_id: product._id});

    return {
        ...product,
        _id: product._id.toString(),
        categories: product.categories.map(c => ({_id: c._id.toString()})),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
    };
}

export async function getCategories() {
    await connectToDatabase()

    const categories = await Category.find().lean()

    return JSON.parse(JSON.stringify(categories))
}