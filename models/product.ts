import mongoose, { Schema, Document, Model } from 'mongoose'

export interface PortionPrice {
    size: string
    price: number
}

export interface IProduct extends Document {
    name: string
    description: string
    prices: PortionPrice[]
    image: string
    categories: mongoose.Types.ObjectId[]
    hidden?: boolean
    createdAt?: Date
    updatedAt?: Date
}

const PortionPriceSchema = new Schema<PortionPrice>(
    {
        size: { type: String, required: true },
        price: { type: Number, required: true },
    },
    { _id: false }
)

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: false },
        prices: { type: [PortionPriceSchema], required: false },
        image: { type: String, required: false },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: false }],
        hidden: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
)

export const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
