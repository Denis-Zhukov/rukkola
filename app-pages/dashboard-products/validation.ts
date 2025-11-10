import {z} from "zod";

export const priceSchema = z.object({
    size: z.string().nonempty('Размер обязателен'),
    price: z.number(),
})

export const productSchema = z.object({
    name: z.string().nonempty('Название обязательно'),
    description: z.string(),
    prices: z.array(priceSchema).min(1, 'Должна быть хотя бы одна цена'),
    categories: z.array(z.string()),
    hidden: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>