"use client";

import {
    Button,
    Box,
    Portal,
    useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRef, useState, useLayoutEffect, useEffect } from "react";

export type NavbarItem = {
    id: string;
    name: string;
    children?: NavbarItem[];
};

type NavItemProps = {
    id: string;
    title: string;
    isActive: boolean;
    onClick: (id: string) => void;
    childrenItems?: NavbarItem[];
};

export const NavItem = ({
                            id,
                            title,
                            isActive,
                            onClick,
                            childrenItems,
                        }: NavItemProps) => {
    const hasChildren = childrenItems && childrenItems.length > 0;
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);

    // Адаптивность: mobile = < md
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Обновляем позицию
    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current) return;

        const update = () => {
            if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
        };

        update();
        const onScroll = () => requestAnimationFrame(update);
        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", update);
        };
    }, [isOpen]);

    // Закрытие при клике/тапе вне
    useEffect(() => {
        if (!isOpen) return;

        const handleOutside = (e: MouseEvent | TouchEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node) &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("touchstart", handleOutside);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("touchstart", handleOutside);
        };
    }, [isOpen]);

    // Закрытие при скролле на мобильных
    useEffect(() => {
        if (!isOpen || !isMobile) return;

        const handleTouchMove = () => setIsOpen(false);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => window.removeEventListener("touchmove", handleTouchMove);
    }, [isOpen, isMobile]);

    const baseButton = (
        <Button
            ref={triggerRef}
            size="sm"
            px={6}
            py={3}
            variant="ghost"
            borderRadius="full"
            fontWeight="medium"
            color={isActive ? "teal.300" : "gray.200"}
            bg="transparent"
            _hover={{ color: "teal.200", transform: "translateY(-2px)" }}
            _active={{ color: "teal.100" }}
            position="relative"
            onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) setIsOpen((v) => !v);
                else onClick(id);
            }}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            {title}
            {hasChildren && (
                <ChevronDownIcon
                    ml={1}
                    transition="transform 0.2s"
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                />
            )}
        </Button>
    );

    if (!hasChildren) return baseButton;

    return (
        <>
            {baseButton}

            {isOpen && rect && (
                <Portal>
                    <Box
                        ref={menuRef}
                        position="fixed"
                        top={`${rect.bottom + 8}px`}
                        left={isMobile ? "50%" : `${rect.left}px`}
                        transform={isMobile ? "translateX(-50%)" : "none"}
                        width={isMobile ? "90vw" : "auto"}
                        maxW={isMobile ? "90vw" : "240px"}
                        // КЛЮЧЕВАЯ СТРОКА — УБИРАЕТ ПРЫЖОК
                        minW={isMobile ? "90vw" : "180px"}
                        zIndex={99999}
                        animation="0.15s ease-out"
                        style={{ animationName: "fadeIn" }}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <Box
                            bgGradient="linear(to-r, rgba(26, 32, 44, 0.85), rgba(26, 32, 44, 0.75))"
                            backdropFilter="blur(14px)"
                            boxShadow="0 8px 30px rgba(0, 0, 0, 0.35)"
                            borderRadius="lg"
                            border="1px solid rgba(255, 255, 255, 0.05)"
                            overflow="hidden"
                        >
                            <Box
                                p={isMobile ? 3 : 2}
                                display="flex"
                                flexDirection="column"
                                gap={isMobile ? 2 : 1}
                                color="white"
                            >
                                {childrenItems!.map((child) => (
                                    <Box
                                        key={child.id}
                                        px={isMobile ? 5 : 4}
                                        py={isMobile ? 3 : 2}
                                        borderRadius="md"
                                        bg="transparent"
                                        _hover={{
                                            bg: "rgba(255,255,255,0.05)",
                                            color: "white",
                                            transform: isMobile ? "none" : "translateX(4px)",
                                        }}
                                        _active={{ bg: "rgba(255,255,255,0.1)" }}
                                        cursor="pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onClick(child.id);
                                            setIsOpen(false);
                                        }}
                                        transition="all 0.2s"
                                        fontSize={isMobile ? "md" : "sm"}
                                        fontWeight="medium"
                                        style={{ minHeight: isMobile ? "48px" : "auto" }}
                                    >
                                        {child.name}
                                    </Box>
                                ))}
                            </Box>

                            {/* Стрелка — только на десктопе */}
                            {!isMobile && (
                                <Box
                                    position="absolute"
                                    top="-8px"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    width={0}
                                    height={0}
                                    borderLeft="8px solid transparent"
                                    borderRight="8px solid transparent"
                                    borderBottom="8px solid rgba(26,32,44,0.85)"
                                    filter="drop-shadow(0 -2px 4px rgba(0,0,0,0.3))"
                                />
                            )}
                        </Box>
                    </Box>

                    <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
                </Portal>
            )}
        </>
    );
};