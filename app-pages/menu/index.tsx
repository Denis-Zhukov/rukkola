import Image from "next/image";
import {Box} from "@chakra-ui/react";
import {Navbar} from "./navbar";
import {Products} from "./products";
import {Footer} from "./footer";
import {CartButton} from "@/components/cart-button";
import {CartModal} from "@/components/cart-modal";
import {ScrollToFooterButton} from "@/components/scroll-footer-button";
import {ProductModal} from "@/components/product-modal";

export const MenuPage = () => (
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

        <Navbar/>

        <Products/>

        <CartButton/>
        <CartModal/>

        <Footer/>

        <ProductModal/>
    </Box>
);
