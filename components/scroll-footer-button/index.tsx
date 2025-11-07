'use client';

import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

export const ScrollToFooterButton = () => {
    const handleClick = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

    return (
        <Box
            py={{ base: 4, md: 6 }}
            px={{ base: 4, md: 6 }}
            textAlign="center"
            position="relative"
            overflow="hidden"
            bg="blackAlpha.900"
            color="white"
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="80px"
                bgGradient="linear(to-b, blackAlpha.700, transparent)"
                pointerEvents="none"
            />

            <Flex
                direction="column"
                align="center"
                justify="center"
                gap={{ base: 3, md: 4 }}
                maxW="4xl"
                mx="auto"
                pos="relative"
            >
                <MotionBox
                    initial={{ y: -12, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.200"
                        maxW="lg"
                        fontWeight="medium"
                    >
                        Адрес, телефон, часы работы — всё в одном месте
                    </Text>
                </MotionBox>

                <Button
                    onClick={handleClick}
                    as={motion.button}
                    size="md"
                    px={{ base: 6, md: 8 }}
                    py={5}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="semibold"
                    color="white"
                    bgGradient="linear(to-r, teal.500, teal.400)"
                    borderRadius="full"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                    _hover={{
                        bgGradient: "linear(to-r, teal.450, teal.350)",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
                    }}
                    _active={{
                        bgGradient: "linear(to-r, teal.600, teal.500)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    <MotionIcon
                        as={FiChevronDown}
                        boxSize={5}
                        animate={{ y: [0, 3, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.3,
                            ease: "easeInOut",
                        }}
                    />
                    Показать
                    <MotionIcon
                        as={FiChevronDown}
                        boxSize={5}
                        animate={{ y: [0, 3, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.3,
                            ease: "easeInOut",
                            delay: 0.15,
                        }}
                    />
                </Button>
            </Flex>

            {/* Нижний градиент */}
            <Box
                position="absolute"
                bottom={0}
                left={0}
                w="full"
                h="60px"
                bgGradient="linear(to-t, blackAlpha.700, transparent)"
                pointerEvents="none"
            />
        </Box>
    );
};