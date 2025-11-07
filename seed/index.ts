import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import fs from "fs"
import mongoose, { Types } from "mongoose"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "../lib/mongoose"
import { Product, IProduct } from "../models/product"
import { Category } from "../models/category"
import { User } from "../models/user"

type Price = {
    size: string
    price: number
}

interface ProductSeedInput {
    name?: string
    description?: string
    prices?: Price[] | null
    image?: string
    categories?: string[]
}

interface CategorySeedInput {
    name: string
    order: number
    isMenuItem: boolean
    showGroupTitle: boolean
}

async function seedDatabase() {
    try {
        await connectToDatabase()
        console.log("✅ Подключено к MongoDB")

        const rawCategoryData = fs.readFileSync("./seed/categories.json", "utf-8")
        const jsonCategories: CategorySeedInput[] = JSON.parse(rawCategoryData)

        await Category.deleteMany({})
        console.log("🗑️ Очищены коллекции Category")

        const categoryDocs = new Map<string, Types.ObjectId>()
        for (const { name, order, showGroupTitle, isMenuItem } of jsonCategories) {
            const { _id } = await Category.create({ name, order, showGroupTitle, isMenuItem })
            categoryDocs.set(name, _id as Types.ObjectId)
        }
        console.log(`📂 Добавлено категорий: ${categoryDocs.size}`)

        // --- Продукты ---
        const rawProductData = fs.readFileSync("./seed/products.json", "utf-8")
        const jsonProducts: ProductSeedInput[] = JSON.parse(rawProductData)

        await Product.deleteMany({})
        console.log("🗑️ Очищены коллекции Product")

        const products: Omit<IProduct, "_id">[] = jsonProducts.map((item) => {
            const name = item.name ?? "Unnamed Product"
            const prices: Price[] = item.prices?.map(({ size, price }) => ({ size, price })) || []
            const categoriesIds = item.categories
                ?.map(category => categoryDocs.get(category))
                .filter(Boolean) as Types.ObjectId[] || []

            return {
                name,
                description: item.description,
                prices,
                image: item.image,
                categories: categoriesIds,
            } as Omit<IProduct, "_id">
        })

        await Product.insertMany(products)
        console.log(`🍕 Добавлено продуктов: ${products.length}`)

        await User.deleteMany({ email: "admin" })
        const hashedPassword = await bcrypt.hash("admin", 10)
        await User.create({
            email: "admin",
            password: hashedPassword,
            name: "Administrator",
            role: "admin",
        })
        console.log("🛡️ Создан суперпользователь: admin / admin")

        await mongoose.connection.close()
        console.log("🚪 Соединение закрыто")
    } catch (err) {
        console.error("❌ Ошибка при заполнении базы:", err)
        process.exit(1)
    }
}

seedDatabase()
