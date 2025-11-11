import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/mongoose";
import { Product, ProductType } from "../models/product";
import { Category } from "../models/category";
import { User } from "../models/user";

type Price = {
    size: string;
    price: number;
};

interface ProductSeedInput {
    name?: string;
    description?: string;
    prices?: Price[] | null;
    image?: string;
    categories?: string[];
}

interface CategorySeedInput {
    name: string;
    order: number;
    isMenuItem: boolean;
    showGroupTitle: boolean;
    parent?: string;
}

async function seedDatabase() {
    try {
        await connectToDatabase();
        console.log("✅ Подключено к MongoDB");

        // === Категории ===
        const rawCategoryData = fs.readFileSync("./seed/categories.json", "utf-8");
        const jsonCategories: CategorySeedInput[] = JSON.parse(rawCategoryData);

        await Category.deleteMany({});
        console.log("🗑️ Очищены коллекции Category");

        // 1️⃣ Создаём все категории без parent, чтобы получить _id
        const createdCategories = await Category.insertMany(
            jsonCategories.map(({ name, order, showGroupTitle, isMenuItem }) => ({
                name,
                order,
                showGroupTitle,
                isMenuItem,
            }))
        );

        const categoryMap = new Map<string, Types.ObjectId>();
        createdCategories.forEach((cat) => categoryMap.set(cat.name, cat._id as Types.ObjectId));

        for (const cat of jsonCategories) {
            if (cat.parent && categoryMap.has(cat.parent)) {
                await Category.updateOne(
                    { name: cat.name },
                    { $set: { parent: categoryMap.get(cat.parent) } }
                );
            }
        }

        console.log(`📂 Добавлено категорий: ${createdCategories.length}`);

        const rawProductData = fs.readFileSync("./seed/products.json", "utf-8");
        const jsonProducts: ProductSeedInput[] = JSON.parse(rawProductData);

        await Product.deleteMany({});
        console.log("🗑️ Очищены коллекции Product");

        const products: Omit<ProductType, "_id">[] = jsonProducts.map((item) => {
            const name = item.name ?? "Unnamed Product";
            const prices: Price[] = item.prices?.map(({ size, price }) => ({ size, price })) || [];

            const categoryIds =
                item.categories
                    ?.map((category) => categoryMap.get(category))
                    .filter(Boolean) as Types.ObjectId[] || [];

            return {
                name,
                description: item.description,
                prices,
                image: item.image,
                categories: categoryIds,
            } as Omit<ProductType, "_id">;
        });

        await Product.insertMany(products);
        console.log(`🍕 Добавлено продуктов: ${products.length}`);

        await User.deleteMany({ username: "admin" });
        const hashedPassword = await bcrypt.hash("admin", 10);
        await User.create({
            username: "admin",
            password: hashedPassword,
            name: "Администратор",
            surname: "Супер",
            patronymic: "Админчик",
            role: "admin",
        });

        console.log("🛡️ Создан суперпользователь: admin / admin");

        await mongoose.connection.close();
        console.log("🚪 Соединение закрыто");
    } catch (err) {
        console.error("❌ Ошибка при заполнении базы:", err);
        process.exit(1);
    }
}

seedDatabase();
