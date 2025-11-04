import {Product} from "@/components/product";
import {SimpleGrid, Heading, Box, Text, Separator} from "@chakra-ui/react";
import {IProduct, Product as ProductDb} from "@/models/product";
import {connectToDatabase} from "@/lib/mongoose";
import {ICategory} from "@/models/category";
import {Divider} from "@chakra-ui/layout";

export const Products = async () => {
    await connectToDatabase();

    const categoriesWithProducts = await ProductDb.aggregate([
        {$unwind: "$categories"},
        {
            $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        {$unwind: "$categoryInfo"},
        {
            $group: {
                _id: "$categoryInfo._id",
                categoryName: {$first: "$categoryInfo.name"},
                categoryOrder: {$first: "$categoryInfo.order"},
                products: {$push: "$$ROOT"}
            }
        },
        {$sort: {categoryOrder: 1}}
    ]);

    const productsWithoutCategory = await ProductDb.find({
        $or: [{categories: {$exists: false}}, {categories: {$size: 0}}]
    }).lean();

    return (
        <Box color="white" minH="100vh" p={8}>
            {categoriesWithProducts.map((cat) => (
                <Box id={cat._id.toString()} key={cat._id.toString()} mb={12}>
                    {cat.showGroupTitle && <Heading
                        fontSize={["2xl", "3xl"]}
                        mb={6}
                        color="teal.300"
                        borderBottom="2px solid"
                        borderColor="teal.500"
                        pb={2}
                    >
                        {cat.categoryName}
                    </Heading>}
                    <SimpleGrid gap={6} columns={[1, 2, 3]}>
                        {(cat.products as IProduct[]).map(({_id: id, image, name, description, prices}) => (
                            <Product
                                key={id.toString()}
                                id={id.toString()}
                                img={image}
                                alt={name}
                                title={name}
                                description={description}
                                prices={prices}
                            />
                        ))}
                    </SimpleGrid>
                </Box>
            ))}

            {productsWithoutCategory.length > 0 && (
                <Box mb={12}>
                    <Heading
                        fontSize={["2xl", "3xl"]}
                        mb={6}
                        color="teal.300"
                        borderBottom="2px solid"
                        borderColor="teal.500"
                        pb={2}
                    >
                        Без категории
                    </Heading>
                    <SimpleGrid gap={6} columns={[1, 2, 3]}>
                        {productsWithoutCategory.map(({_id: id, image, name, description, prices}) => (
                            <Product
                                key={id.toString()}
                                img={image}
                                alt={name}
                                title={name}
                                description={description}
                                prices={prices}
                            />
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </Box>
    );
};
