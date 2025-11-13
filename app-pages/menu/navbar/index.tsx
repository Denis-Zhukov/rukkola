'use client';

import {useEffect, useRef, useState} from "react";
import {HStack, Box} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import {useSearchParams} from "next/navigation";
import {NavbarItem, NavItem} from "./nav-item";
import {CART_QUERY_KEY} from "@/app-pages/menu/config";

const MotionBox = motion(Box);

type NavbarProps = {
    items: NavbarItem[];
};

export const Navbar = ({items}: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [isFixed, setIsFixed] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const [navHeight, setNavHeight] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const searchParams = useSearchParams();

    useEffect(() => {
        const updateNavHeightAndThreshold = () => {
            if (!navRef.current) return;
            const height = navRef.current.offsetHeight;
            setNavHeight(height);

            const firstSection = document.getElementById(items[0].id);
            if (!firstSection) return;

            setThreshold(firstSection.offsetTop - height - 10);
        };

        updateNavHeightAndThreshold();
        window.addEventListener("resize", updateNavHeightAndThreshold);
        return () => window.removeEventListener("resize", updateNavHeightAndThreshold);
    }, [items]);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
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
    }, [items, threshold]);

    const handleClick = (id: string) => {
        const section = document.getElementById(id);
        if (!section || !navRef.current) return;

        window.scrollTo({
            top: section.offsetTop - navHeight,
            behavior: "smooth",
        });
    };

    if (searchParams.has(CART_QUERY_KEY)) return null;

    return (
        <Box position="relative" zIndex="10">
            {/* Пустой блок для предотвращения прыжка контента */}
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
                        {items.map((item) => (
                            <NavItem
                                key={item.id}
                                id={item.id}
                                title={item.name}
                                isActive={active === item.id}
                                onClick={handleClick}
                                childrenItems={item.children}
                            />
                        ))}
                    </HStack>
                </MotionBox>
            </AnimatePresence>
        </Box>
    );
};
