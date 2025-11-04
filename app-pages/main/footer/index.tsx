"use client";

import { Box, Flex, Text, Icon, Stack, Link } from "@chakra-ui/react";
import { Phone, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export const Footer = () => {
    return (
        <Box
            as="footer"
            mt={20}
            py={10}
            px={{ base: 6, md: 10 }}
            bgGradient="linear(to-r, rgba(26,32,44,0.85), rgba(26,32,44,0.75))"
            backdropFilter="blur(12px)"
            borderTop="1px solid rgba(255,255,255,0.08)"
            boxShadow="0 -6px 24px rgba(0,0,0,0.35)"
            color="gray.200"
        >
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                gap={8}
                maxW="6xl"
                mx="auto"
            >
                {/* Адрес */}
                <Stack direction="row" align="flex-start">
                    <Icon as={MapPin} color="teal.300" mt={1} boxSize={5} />
                    <Box>
                        <Text fontWeight="semibold" color="teal.200">
                            Адрес:
                        </Text>
                        <MotionLink
                            href="https://www.google.com/maps/search/?api=1&query=ул.+Советская,+60,+новый+универмаг,+Руккола"
                            fontWeight="medium"
                            color="gray.100"
                            cursor="pointer"
                            display="inline-flex"
                            alignItems="center"
                            gap={1}
                            _hover={{ color: "teal.300" }}
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            ул. Советская, 60
                            <Icon as={ArrowUpRight} boxSize={3} opacity={0.7} />
                        </MotionLink>
                        <Text color="gray.400" fontSize="sm">(новый универмаг)</Text>
                    </Box>
                </Stack>

                {/* Телефон */}
                <Stack direction="row" align="flex-start">
                    <Icon as={Phone} color="teal.300" mt={1} boxSize={5} />
                    <Box>
                        <Text fontWeight="semibold" color="teal.200">
                            Телефон:
                        </Text>
                        <MotionLink
                            href="tel:+375447703003"
                            fontWeight="medium"
                            color="gray.100"
                            cursor="pointer"
                            display="inline-flex"
                            alignItems="center"
                            gap={1}
                            _hover={{ color: "teal.300" }}
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            +375 (44) 770-30-03
                            <Icon as={ArrowUpRight} boxSize={3} opacity={0.7} />
                        </MotionLink>
                    </Box>
                </Stack>

                {/* Время работы */}
                <Stack direction="row" align="flex-start">
                    <Icon as={Clock} color="teal.300" mt={1} boxSize={5} />
                    <Box>
                        <Text fontWeight="semibold" color="teal.200">
                            Время работы:
                        </Text>
                        <Text color="gray.200">12:00 — 23:00</Text>
                        <Text color="gray.400" fontSize="sm">без выходных</Text>
                    </Box>
                </Stack>
            </Flex>

            <Box
                textAlign="center"
                mt={10}
                fontSize="sm"
                color="gray.500"
                borderTop="1px solid rgba(255,255,255,0.08)"
                pt={6}
            >
                © {new Date().getFullYear()} Все права защищены
            </Box>
        </Box>
    );
};