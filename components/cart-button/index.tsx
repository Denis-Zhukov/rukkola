"use client";

import {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Box, Badge, IconButton} from "@chakra-ui/react";
import {FiShoppingCart, FiX} from "react-icons/fi";
import {useRouter, usePathname, useSearchParams} from "next/navigation";

const MotionBox = motion(Box);

const CART_KEY = "localCart";
const CART_TTL = 24 * 60 * 60 * 1000;

const getCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        const now = Date.now();
        const filtered = data.filter((item: any) => now - item.timestamp < CART_TTL);
        localStorage.setItem(CART_KEY, JSON.stringify(filtered));
        return filtered;
    } catch {
        return [];
    }
};

export const CartButton = () => {
    const [count, setCount] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isOpen = searchParams.get("cart") === "true";

    useEffect(() => {
        setCount(getCart().length);
        const handleStorage = () => setCount(getCart().length);
        window.addEventListener("storage", handleStorage);
        const interval = setInterval(handleStorage, 2000);
        return () => {
            window.removeEventListener("storage", handleStorage);
            clearInterval(interval);
        };
    }, []);

    const toggleCart = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (isOpen) params.delete("cart");
        else params.set("cart", "true");
        router.push(`${pathname}?${params.toString()}`, {scroll: false});
    };

    return (
        <AnimatePresence>
            {(count > 0 || isOpen) && (
                <MotionBox
                    position="fixed"
                    bottom="28px"
                    right="28px"
                    zIndex="1000"
                    initial={{opacity: 0, scale: 0.8, y: 20}}
                    animate={{opacity: 1, scale: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.8, y: 20}}
                    transition={{
                        duration: 0.35,
                        type: "spring",
                        stiffness: 200,
                        damping: 18,
                    }}
                >
                    <Box position="relative">
                        <MotionBox
                            position="absolute"
                            inset="-10px"
                            borderRadius="full"
                            bg="teal.400"
                            filter="blur(16px)"
                            opacity={0.25}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.2, 0.35, 0.25],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "mirror",
                            }}
                        />

                        <IconButton
                            aria-label={isOpen ? "Закрыть корзину" : "Открыть корзину"}
                            borderRadius="full"
                            size="lg"
                            onClick={toggleCart}
                            bg="linear-gradient(145deg, #1c1f1e, #232826)"
                            color="teal.200"
                            boxShadow="
                0 6px 12px rgba(0,0,0,0.45),
                inset 0 -2px 4px rgba(255,255,255,0.05),
                inset 0 2px 6px rgba(255,255,255,0.05)
              "
                            _hover={{
                                transform: "translateY(-3px) scale(1.05)",
                                color: "teal.100",
                                boxShadow: `
                  0 10px 18px rgba(0,0,0,0.6),
                  inset 0 -3px 6px rgba(255,255,255,0.08),
                  inset 0 3px 8px rgba(255,255,255,0.08),
                  0 0 12px rgba(56,178,172,0.4)
                `,
                            }}
                            _active={{
                                transform: "scale(0.96)",
                                boxShadow: `
                  0 5px 10px rgba(0,0,0,0.5),
                  inset 0 2px 4px rgba(0,0,0,0.4)
                `,
                            }}
                            transition="all 0.25s ease">
                            {isOpen ? (
                                <FiX size={22}/>
                            ) : (
                                <FiShoppingCart size={22}/>
                            )}
                        </IconButton>

                        <Badge
                            position="absolute"
                            top="-5px"
                            right="-5px"
                            borderRadius="full"
                            bgGradient="linear(to-br, teal.400, green.300)"
                            color="black"
                            fontSize="xs"
                            px="2"
                            py="1px"
                            fontWeight="bold"
                            boxShadow="0 0 8px rgba(56,178,172,0.6)"
                            as={motion.div}
                            animate={{scale: [1, 1.15, 1]}}
                        >
                            {count}
                        </Badge>
                    </Box>
                </MotionBox>
            )}
        </AnimatePresence>
    );
};
