"use client";

import {Box, Flex, VStack, Text, Icon, IconButton} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {
    FiHome,
    FiBox,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiMenu,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import {useRouter, usePathname} from "next/navigation";
import {signOut} from "next-auth/react";
import {useState} from "react";

const MotionBox = motion(Box);

const menuItems = [
    {label: "Главная", icon: FiHome, path: "/dashboard"},
    {label: "Товары", icon: FiBox, path: "/dashboard/products"},
    {label: "Категории", icon: FiUsers, path: "/dashboard/categories"},
    {label: "Настройки", icon: FiSettings, path: "/dashboard/settings"},
];

export const DashboardLayout = ({children}: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarBg = "gray.800";
    const activeColor = "teal.400";
    const textColor = "gray.300";
    const dividerColor = "rgba(255,255,255,0.08)";

    return (
        <Flex minH="100vh" bg="gray.900" color="white" flexDir={{base: "column", md: "row"}}>
            <Flex
                display={{base: "flex", md: "none"}}
                justify="space-between"
                align="center"
                bg={sidebarBg}
                px={4}
                py={3}
                borderBottom={`1px solid ${dividerColor}`}
            >
                <Flex align="center" gap={2}>
                    <Icon as={MdDashboard} color="teal.300" boxSize={5} />
                    <Text fontWeight="bold" fontSize="lg" color="teal.300">
                        Админ панель
                    </Text>
                </Flex>
                <IconButton
                    aria-label="Menu"
                    variant="ghost"
                    color="white"
                    _hover={{bg: "rgba(56,178,172,0.1)"}}
                    onClick={() => setMobileOpen(!mobileOpen)}>
                    <FiMenu/>
                </IconButton>
            </Flex>

            <MotionBox
                w={{base: mobileOpen ? "100%" : 0, md: "260px"}}
                bg={sidebarBg}
                p={{base: mobileOpen ? 6 : 0, md: 6}}
                borderRight={{base: "none", md: `1px solid ${dividerColor}`}}
                display={{base: mobileOpen ? "block" : "none", md: "flex"}}
                flexDir="column"
                justifyContent="space-between"
                initial={{x: -40, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.4}}
                position={{ md: "fixed" }}
                top={{ md: 0 }}
                left={{ md: 0 }}
                height={{ md: "100vh" }}
                overflowY={{ md: "auto" }}
                zIndex={{ md: 10 }}
            >
                <VStack align="stretch">
                    <Box
                        display={{base: "none", md: "block"}}
                        textAlign="center"
                        fontWeight="bold"
                        fontSize="xl"
                        color="teal.300"
                        mb={6}
                    >
                        <Flex justify="center" align="center" gap={2}>
                            <Icon as={MdDashboard} color="teal.300" boxSize={6} />
                            <Text fontWeight="bold" fontSize="xl" color="teal.300">
                                Админ панель
                            </Text>
                        </Flex>
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
                                    onClick={() => {
                                        router.push(item.path);
                                        setMobileOpen(false);
                                    }}
                                >
                                    <Icon as={item.icon} boxSize={5}/>
                                    <Text fontWeight="medium">{item.label}</Text>
                                </Flex>
                            );
                        })}
                    </VStack>
                </VStack>

                <Box mt={4}>
                    <Box my={4} h="1px" bg={dividerColor}/>
                    <Flex
                        align="center"
                        gap={3}
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        color="gray.400"
                        cursor="pointer"
                        _hover={{bg: "rgba(56,178,172,0.1)", color: "red.300"}}
                        transition="all 0.2s ease"
                        onClick={() => signOut({redirectTo: "/"})}
                    >
                        <Icon as={FiLogOut} boxSize={5}/>
                        <Text fontWeight="medium">Выйти</Text>
                    </Flex>
                </Box>
            </MotionBox>

            <Box flex="1" p={{base: 4, md: 10}} overflowX="auto" ml={{ md: "260px" }}>
                {children}
            </Box>
        </Flex>
    );
};