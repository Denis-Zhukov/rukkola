'use client';

import {useEffect, useRef, useState} from "react";
import {HStack, Box} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import {useSearchParams} from "next/navigation";
import {NavItem} from "./nav-item";
import {CART_QUERY_KEY} from "@/app-pages/menu/config";

const MotionBox = motion(Box);

type NavbarProps = {
    items: Array<{ id: string; name: string }>;
};

export const Navbar = ({items}: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [isFixed, setIsFixed] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const [navHeight, setNavHeight] = useState(0);
    const searchParams = useSearchParams();

    useEffect(() => {
        const updateHeight = () => navRef.current && setNavHeight(navRef.current.offsetHeight);
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const threshold = 300;
            setIsFixed(y > threshold);

            const scrollPos = y + window.innerHeight / 3;
            const current = items.find(({id}) => {
                const section = document.getElementById(id);
                if (!section) return false;
                return scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight;
            });
            setActive(current?.id || null);
        };

        window.addEventListener("scroll", handleScroll, {passive: true});
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [items]);

    const handleClick = (id: string) => {
        const section = document.getElementById(id);
        if (!section || !navRef.current) return;

        window.scrollTo({
            top: section.offsetTop - (navRef.current.offsetHeight + navHeight),
            behavior: "smooth",
        });
    };

    if (searchParams.has(CART_QUERY_KEY)) return null;

    return (
        <Box position="relative" zIndex="10">
            {isFixed && <Box height={navHeight}/>}
            <AnimatePresence>
                <MotionBox
                    ref={navRef}
                    as="nav"
                    position={isFixed ? "fixed" : "relative"}
                    top={0}
                    left={0}
                    right={0}
                    zIndex={100}
                    mx="auto"
                    bgGradient="linear(to-r, rgba(26, 32, 44, 0.85), rgba(26, 32, 44, 0.75))"
                    backdropFilter="blur(14px)"
                    boxShadow="0 8px 30px rgba(0,0,0,0.35)"
                    py={4}
                    borderBottom={isFixed ? "1px solid rgba(255,255,255,0.08)" : "none"}
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4, ease: "easeOut"}}
                >
                    <HStack wrap="wrap" justify="center">
                        {items.map(({id, name}) => (
                            <NavItem
                                key={id}
                                id={id}
                                title={name}
                                isActive={active === id}
                                onClick={handleClick}
                            />
                        ))}
                    </HStack>
                </MotionBox>
            </AnimatePresence>
        </Box>
    );
};
