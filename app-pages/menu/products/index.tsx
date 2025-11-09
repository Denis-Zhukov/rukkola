import {Box} from "@chakra-ui/react";
import {ProductType, Product as ProductDb} from "@/models/product";
import {connectToDatabase} from "@/lib/mongoose";
import {ProductGroup} from "./product-group";

export const Products = async () => {
    await connectToDatabase();

    const categoriesWithProducts = await ProductDb.aggregate([{$match: {$or: [{hidden: {$exists: false}}, {hidden: false}]}}, {$unwind: "$categories"}, {
        $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categoryInfo"
        }
    }, {$unwind: "$categoryInfo"}, {
        $group: {
            _id: "$categoryInfo._id",
            categoryName: {$first: "$categoryInfo.name"},
            categoryOrder: {$first: "$categoryInfo.order"},
            showGroupTitle: {$first: "$categoryInfo.showGroupTitle"},
            products: {$push: "$$ROOT"}
        }
    }, {$sort: {categoryOrder: 1}}]);

    const productsWithoutCategory = await ProductDb.find({
        $or: [{ categories: { $exists: false } }, { categories: { $size: 0 } }],
    }).lean<ProductType[]>();

    return (
        <Box color="white" minH="100vh" p={2}>
            {categoriesWithProducts.map((cat) => (
                <ProductGroup
                    key={cat._id.toString()}
                    id={cat._id.toString()}
                    title={cat.showGroupTitle ? cat.categoryName : undefined}
                    products={cat.products}
                />
            ))}

            {productsWithoutCategory.length > 0 && <ProductGroup
                title="Без категории"
                products={productsWithoutCategory}
            />}
        </Box>
    );
};
