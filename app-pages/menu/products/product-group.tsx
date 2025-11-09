import {ProductType} from "@/models/product";
import {Box, Heading, SimpleGrid} from "@chakra-ui/react";
import {Product} from "./product";

type ProductGroupProps = {
    id?: string;
    title?: string;
    products: ProductType[]
}

export const ProductGroup = ({id, title, products}: ProductGroupProps) => {
    if (!products.length) return null;

    return (
        <Box mb={12} id={id}>
            {title && (
                <Heading
                    fontSize={["2xl", "3xl"]}
                    mb={6}
                    color="teal.300"
                    borderBottom="2px solid"
                    pb={2}
                >
                    {title}
                </Heading>
            )}

            <SimpleGrid gap={6} columns={{ base: 1, sm: 2, xl: 3 }}>
                {products.map(({_id, image, name, description, prices}) => (
                    <Product
                        key={_id.toString()}
                        id={_id.toString()}
                        img={image}
                        alt={name}
                        title={name}
                        description={description}
                        prices={prices}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
};