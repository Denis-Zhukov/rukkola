import mongoose, {Schema, Document, Model} from 'mongoose'

export interface ICategory extends Document {
    name: string
    order: number
    isMenuItem: boolean
    showGroupTitle: boolean
}

const CategorySchema = new Schema<ICategory>({
    name: {type: String, required: true, unique: true, trim: true},
    order: {type: Number, required: true, unique: true},
    isMenuItem: {type: Boolean, required: true, unique: false},
    showGroupTitle: {type: Boolean, required: true, unique: false},
})

export const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
