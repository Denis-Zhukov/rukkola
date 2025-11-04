"use client";

import { Box, Flex, Text, Icon, Stack, Link } from "@chakra-ui/react";
import { Phone, Clock, MapPin } from "lucide-react";

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
            transition="opacity 0.6s ease, transform 0.6s ease"
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
                        <Link
                            href="https://www.google.com/maps/search/?api=1&query=ул.+Советская,+60,+новый+универмаг,+Руккола"
                            fontWeight="medium"
                            color="gray.200"
                            _hover={{ color: "teal.300", textDecoration: "underline" }}
                        >
                            ул. Советская, 60
                        </Link>
                        <Text color="gray.400">(новый универмаг)</Text>
                    </Box>
                </Stack>

                <Stack direction="row" align="flex-start">
                    <Icon as={Phone} color="teal.300" mt={1} boxSize={5} />
                    <Box>
                        <Text fontWeight="semibold" color="teal.200">
                            Телефон:
                        </Text>
                        <Link
                            href="tel:+375447703003"
                            fontWeight="medium"
                            color="gray.200"
                            _hover={{ color: "teal.300", textDecoration: "underline" }}
                        >
                            +375 (44) 770-30-03
                        </Link>
                    </Box>
                </Stack>

                <Stack direction="row" align="flex-start">
                    <Icon as={Clock} color="teal.300" mt={1} boxSize={5} />
                    <Box>
                        <Text fontWeight="semibold" color="teal.200">
                            Время работы:
                        </Text>
                        <Text color="gray.200">12:00 — 23:00</Text>
                        <Text color="gray.400">без выходных</Text>
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
