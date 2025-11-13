import Image from "next/image";
import {Box, Flex} from "@chakra-ui/react";
import {Navbar} from "./navbar";
import {Products} from "./products";
import {Footer} from "./footer";
import {CartButton} from "./cart-button";
import {CartModal} from "@/components/cart-modal";
import {ScrollToFooterButton} from "@/components/scroll-footer-button";
import {ProductModal} from "@/components/product-modal";
import {connectToDatabase} from "@/lib/mongoose";
import {Category} from "@/models/category";
import {Lunch} from "@/models/lunch";

export const MenuPage = async () => {
    await connectToDatabase();

    const activeLunch = await Lunch.findOne({active: true}).lean()

    const categories = await Category.find({isMenuItem: true})
        .sort({order: 1})
        .lean();

    const navItems = categories
        .filter(cat => !cat.parent)
        .map(parent => ({
            id: parent._id.toString(),
            name: parent.name,
            children: categories
                .filter(c => c.parent?.toString() === parent._id.toString())
                .map(sub => ({
                    id: sub._id.toString(),
                    name: sub.name,
                })),
        }));

    return (
        <Box
            display="flex"
            flexDirection="column"
            maxW="1440px"
            w="100%"
            mx="auto"
            p="20px"
        >
            <Box
                mx="auto"
                w={{ base: "80%", sm: "60%", md: "400px" }}
                maxW="90vw"
                mb={{ base: 4, md: 6 }}
            >
                <Image
                    src="/logo.svg"
                    alt="logo"
                    width={400}
                    height={200}
                    style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                    }}
                    priority
                />
            </Box>

            {activeLunch?.image && (
                <Flex justify="center" align="center" mt={4} mb={6}>
                    <Box
                        position="relative"
                        overflow="hidden"
                        rounded="xl"
                        boxShadow="0 0 15px rgba(56,178,172,0.4)"
                        border="1px solid"
                        borderColor="teal.700"
                        maxW="600px"
                        w="100%"
                        transition="all 0.3s ease"
                        _hover={{
                            transform: "scale(1.015)",
                            boxShadow: "0 0 25px rgba(56,178,172,0.5)",
                        }}
                    >
                        <Image
                            src={activeLunch.image}
                            alt="Обеденное меню"
                            width={800}
                            height={220}
                            style={{
                                borderRadius: "12px",
                                objectFit: "contain",
                            }}
                            priority
                        />
                    </Box>
                </Flex>
            )}

            <ScrollToFooterButton/>

            <Navbar items={navItems}/>

            <Products/>

            <CartButton/>
            <CartModal/>

            <Footer/>

            <ProductModal/>
        </Box>
    );
}
