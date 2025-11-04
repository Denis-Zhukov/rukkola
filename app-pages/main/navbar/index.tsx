'use client';

import {useEffect, useRef, useState} from "react";
import {Button, HStack, Box} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import {getNavItems} from "./actions";
import styles from "./style.module.css";
import {useSearchParams} from "next/navigation";

const MotionBox = motion(Box);

export const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const [isFixed, setIsFixed] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const [navHeight, setNavHeight] = useState(0);
    const [items, setItems] = useState<Array<{ id: string; name: string; }>>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (navRef.current) setNavHeight(navRef.current.offsetHeight);

        const handleScroll = () => {
            const y = window.scrollY;
            const threshold = 200;
            setIsFixed(y > threshold);

            const scrollPos = y + window.innerHeight / 3;
            let current: string | null = null;

            items.forEach((it) => {
                const id = it.id;
                const section = document.getElementById(id);
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    if (scrollPos >= top && scrollPos < bottom) current = id;
                }
            });

            setActive(current);
        };

        window.addEventListener("scroll", handleScroll, {passive: true});
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        getNavItems().then((items) => setItems(items))
    }, []);

    const handleClick = (id: string) => {
        const section = document.getElementById(id);
        if (section && navRef.current) {
            const offset = navRef.current.offsetHeight + 45;
            window.scrollTo({
                top: section.offsetTop - offset,
                behavior: "smooth",
            });
        }
    };

    const cartIsOpen = searchParams.get("cart") === "true";
    if (cartIsOpen) return null;

    return (
        <Box position="relative" zIndex="10">
            {isFixed && <Box height={`${navHeight}px`}/>}

            <AnimatePresence>
                <MotionBox
                    ref={navRef}
                    as="nav"
                    position={isFixed ? "fixed" : "relative"}
                    top="0"
                    left="0"
                    right="0"
                    zIndex="100"
                    mx="auto"
                    bgGradient={
                        isFixed
                            ? "linear(to-r, rgba(26, 32, 44, 0.85), rgba(26, 32, 44, 0.75))"
                            : "linear(to-r, rgba(26, 32, 44, 0.4), rgba(26, 32, 44, 0.2))"
                    }
                    backdropFilter={isFixed ? "blur(14px)" : "blur(8px)"}
                    boxShadow={
                        isFixed
                            ? "0 8px 30px rgba(0,0,0,0.35)"
                            : "0 4px 16px rgba(0,0,0,0.15)"
                    }
                    py={4}
                    borderBottom={isFixed ? "1px solid rgba(255,255,255,0.08)" : "none"}
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.4, ease: "easeOut"}}
                >
                    <HStack wrap="wrap" justify="center" className={styles.selector}>
                        {items.map((it) => {
                            const id = it.id;
                            const title = it.name;
                            const isActive = active === id;

                            return (
                                <Button
                                    key={id}
                                    size="sm"
                                    px={6}
                                    py={3}
                                    variant="ghost"
                                    borderRadius="full"
                                    fontWeight="medium"
                                    color={isActive ? "teal.300" : "gray.200"}
                                    bg={isActive ? "rgba(56,178,172,0.18)" : "transparent"}
                                    transition="all 0.3s ease"
                                    _hover={{
                                        bg: "rgba(56,178,172,0.15)",
                                        color: "teal.200",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 6px 14px rgba(56,178,172,0.15)",
                                    }}
                                    _active={{
                                        bg: "rgba(56,178,172,0.25)",
                                        color: "teal.100",
                                    }}
                                    position="relative"
                                    onClick={() => handleClick(id)}
                                >
                                    {title}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            style={{
                                                position: "absolute",
                                                bottom: "-2px",
                                                left: "50%",
                                                width: "50%",
                                                height: "2px",
                                                borderRadius: "2px",
                                                background: "linear-gradient(90deg, #38B2AC, #81E6D9)",
                                                transform: "translateX(-50%)",
                                            }}
                                            transition={{duration: 0.25}}
                                        />
                                    )}
                                </Button>
                            );
                        })}
                    </HStack>
                </MotionBox>
            </AnimatePresence>
        </Box>
    );
};
