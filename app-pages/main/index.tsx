import Image from "next/image";
import styles from './style.module.css';
import {Navbar} from "./navbar";
import {Products} from "./products";
import {Footer} from "./footer";
import {CartButton} from "@/components/cart-button";
import {CartModal} from "@/components/cart-modal";

export const Main = () => {
    return <div className={styles.wrapper}>
        <Image
            src="/logo.svg"
            width={400}
            height={200}
            alt="logo"
            className={styles.title}
        ></Image>

        <Navbar/>

        <Products/>

        <CartButton/>
        <CartModal/>

        <Footer/>
    </div>
}