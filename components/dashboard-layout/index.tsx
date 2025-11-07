"use client";

import {
    Box,
    Flex,
    VStack,
    Text,
    Icon
} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {
    FiHome,
    FiBox,
    FiUsers,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";
import {useRouter, usePathname} from "next/navigation";
import {signOut} from "next-auth/react";

const MotionBox = motion(Box);

const menuItems = [
    {label: "Главная", icon: FiHome, path: "/dashboard"},
    {label: "Товары", icon: FiBox, path: "/dashboard/products"},
    {label: "Категории", icon: FiUsers, path: "/dashboard/categories"},
    {label: "Настройки", icon: FiSettings, path: "/dashboard/settings"},
];

export const DashboardLayout = ({
                                    children,
                                }: {
    children: React.ReactNode;
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const sidebarBg = "gray.800";
    const activeColor = "teal.400";
    const textColor = "gray.300";
    const dividerColor = "rgba(255,255,255,0.08)";

    return (
        <Flex minH="100vh" bg="gray.900" color="white">
            {/* Sidebar */}
            <MotionBox
                w="260px"
                bg={sidebarBg}
                p={6}
                borderRight={`1px solid ${dividerColor}`}
                display="flex"
                flexDir="column"
                justifyContent="space-between"
                initial={{x: -40, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.4}}
            >
                <VStack align="stretch">
                    <Box textAlign="center" fontWeight="bold" fontSize="xl" color="teal.300">
                        🍕 Admin Panel
                    </Box>

                    <VStack align="stretch">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Flex
                                    key={item.path}
                                    align="center"
                                    gap={3}
                                    px={3}
                                    py={2.5}
                                    borderRadius="md"
                                    bg={isActive ? "rgba(56,178,172,0.15)" : "transparent"}
                                    color={isActive ? activeColor : textColor}
                                    cursor="pointer"
                                    _hover={{
                                        bg: "rgba(56,178,172,0.1)",
                                        color: activeColor,
                                        transform: "translateX(2px)",
                                    }}
                                    transition="all 0.2s ease"
                                    onClick={() => router.push(item.path)}
                                >
                                    <Icon as={item.icon} boxSize={5}/>
                                    <Text fontWeight="medium">{item.label}</Text>
                                </Flex>
                            );
                        })}
                    </VStack>
                </VStack>

                <Box>
                    <Box my={4} h="1px" bg={dividerColor}/>
                    <Flex
                        align="center"
                        gap={3}
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        color="gray.400"
                        cursor="pointer"
                        _hover={{
                            bg: "rgba(56,178,172,0.1)",
                            color: "red.300",
                        }}
                        transition="all 0.2s ease"
                        onClick={() => signOut({redirectTo: '/'})}
                    >
                        <Icon as={FiLogOut} boxSize={5}/>
                        <Text fontWeight="medium">Выйти</Text>
                    </Flex>
                </Box>
            </MotionBox>

            <Box flex="1" p={10} overflowX="auto">
                {children}
            </Box>
        </Flex>
    );
}
