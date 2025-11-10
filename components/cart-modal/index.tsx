"use client";

import {useEffect, useState} from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/modal";
import {Box, Button, Flex, Text, Image, Icon} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import {useSearchParams, usePathname, useRouter} from "next/navigation";
import {FiShoppingCart} from "react-icons/fi";
import {CartItem, getCart, setCart} from "@/lib/local-storage";

const MotionBox = motion(Box);

export const CartModal = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(searchParams.get("cart") === "true");
    }, [searchParams]);

    useEffect(() => {
        if (isOpen) setItems(getCart());
    }, [isOpen]);

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("cart");
        router.push(`${pathname}?${params.toString()}`, {scroll: false});
    };

    const handleRemove = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
        setCart(updated);
    };

    const handleClear = () => {
        setItems([]);
        setCart([]);
    };

    const closeCart = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("cart");
        router.replace(`${pathname}?${params.toString()}`, {scroll: false});
    };

    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    isCentered
                    size="md"
                    motionPreset="scale"
                >
                    <ModalOverlay bg="rgba(0,0,0,0.75)" backdropFilter="blur(8px)" onClick={closeCart}/>

                    <ModalContent
                        as={motion.div}
                        bg="linear-gradient(145deg, #0a0a0a, #111)"
                        border="1px solid rgba(56,178,172,0.25)"
                        borderRadius="2xl"
                        boxShadow="0 0 25px rgba(56,178,172,0.15)"
                        maxH="85vh"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                        initial={{opacity: 0, scale: 0.9, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.9, y: 10}}
                    >
                        <ModalHeader
                            color="teal.300"
                            fontWeight="bold"
                            fontSize="lg"
                            letterSpacing="wide"
                            pt={4}
                            px={6}
                            borderBottom="1px solid rgba(56,178,172,0.15)"
                        >
                            Ваша корзина
                        </ModalHeader>

                        <ModalCloseButton color="gray.400" _hover={{color: "teal.300"}}/>

                        <ModalBody px={6} py={3} overflowY="auto" flex="1">
                            {items.length === 0 ? (
                                <Flex
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    py={12}
                                    color="gray.400"
                                    gap={3}
                                >
                                    <Icon as={FiShoppingCart} boxSize={10} color="teal.500"/>
                                    <Text>Корзина пуста</Text>
                                </Flex>
                            ) : (
                                <Flex direction="column" gap={3}>
                                    {items.map((item, i) => (
                                        <MotionBox
                                            key={i}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            p={3}
                                            bg="rgba(255,255,255,0.03)"
                                            borderRadius="lg"
                                            border="1px solid transparent"
                                            initial={{opacity: 0, y: 10}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{duration: 0.25, delay: i * 0.04}}
                                            whileHover={{
                                                borderColor: "rgba(56,178,172,0.3)",
                                                boxShadow: "0 0 8px rgba(56,178,172,0.2)",
                                                backgroundColor: "rgba(255,255,255,0.05)",
                                            }}
                                        >
                                            <Flex align="center" gap={3}>
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                        borderRadius="md"
                                                        objectFit="cover"
                                                        border="1px solid rgba(56,178,172,0.25)"
                                                    />
                                                )}
                                                <Box>
                                                    <Text
                                                        color="whiteAlpha.900"
                                                        fontWeight="medium"
                                                        fontSize="sm"
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    {item.size && (
                                                        <Text color="gray.500" fontSize="xs">
                                                            Размер: {item.size}
                                                        </Text>
                                                    )}
                                                </Box>
                                            </Flex>

                                            <Flex align="center" gap={3}>
                                                <Text color="teal.300" fontWeight="semibold" fontSize="sm">
                                                    {item.price != null
                                                        ? `${item.price?.toFixed(2).replace(".", ",")} руб.`
                                                        : "—"}
                                                </Text>
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    color="gray.500"
                                                    _hover={{
                                                        color: "red.400",
                                                        bg: "rgba(255,0,0,0.06)",
                                                    }}
                                                    onClick={() => handleRemove(i)}
                                                >
                                                    ✕
                                                </Button>
                                            </Flex>
                                        </MotionBox>
                                    ))}
                                </Flex>
                            )}
                        </ModalBody>

                        {items.length > 0 && (
                            <Box
                                px={6}
                                py={4}
                                borderTop="1px solid rgba(56,178,172,0.2)"
                                bg="rgba(0,0,0,0.5)"
                                backdropFilter="blur(4px)"
                            >
                                <Flex justify="space-between" align="center">
                                    <Text color="gray.400" fontSize="sm">
                                        Итого:
                                    </Text>
                                    <Flex align="center" gap={3}>
                                        <Text color="teal.300" fontWeight="bold">
                                            {total.toFixed(2).replace(".", ",")} руб.
                                        </Text>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            color="red.400"
                                            borderColor="rgba(255,0,0,0.4)"
                                            p={2}
                                            _hover={{
                                                bg: "rgba(255,0,0,0.08)",
                                                borderColor: "rgba(255,0,0,0.5)",
                                            }}
                                            onClick={handleClear}
                                        >
                                            Очистить
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Box>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </AnimatePresence>
    );
};
