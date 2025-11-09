import Image from "next/image";
import {Box} from "@chakra-ui/react";
import {Navbar} from "./navbar";
import {Products} from "./products";
import {Footer} from "./footer";
import {CartButton} from "./cart-button";
import {CartModal} from "@/components/cart-modal";
import {ScrollToFooterButton} from "@/components/scroll-footer-button";
import {ProductModal} from "@/components/product-modal";
import {connectToDatabase} from "@/lib/mongoose";
import {Category} from "@/models/category";

export const MenuPage = async () => {
    await connectToDatabase();

    const categories = await Category.find()
        .sort({ order: 1 })
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
            <Box mx="auto" w="400px" h="200px">
                <Image
                    src="/logo.svg"
                    width={400}
                    height={200}
                    alt="logo"
                />
            </Box>

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
