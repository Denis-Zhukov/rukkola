"use client";

import { Box, Flex, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiBox, FiLayers, FiUsers } from "react-icons/fi";

const MotionBox = motion(Box);

interface StatsGridProps {
    stats: {
        products: number;
        categories: number;
        users: number;
    };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 4, md: 6 }}>
            <StatBox
                label="Товары"
                value={stats.products}
                icon={FiBox}
                helpText="Всего доступных товаров"
            />
            <StatBox
                label="Категории"
                value={stats.categories}
                icon={FiLayers}
                helpText="Всего категорий"
            />
            <StatBox
                label="Пользователи"
                value={stats.users}
                icon={FiUsers}
                helpText="Всего пользователей"
            />
        </SimpleGrid>
    );
};

interface StatBoxProps {
    label: string;
    value: number;
    icon: React.ElementType;
    helpText?: string;
}

const StatBox = ({ label, value, icon, helpText }: StatBoxProps) => (
    <MotionBox
        p={{ base: 5, md: 6 }}
        bg="gray.800"
        borderRadius="2xl"
        boxShadow="0 8px 24px rgba(0,0,0,0.3)"
        _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <Flex align="center" gap={{ base: 3, md: 4 }} mb={4} flexWrap="wrap">
            <Box
                bg="rgba(56,178,172,0.06)"
                p={{ base: 3, md: 4 }}
                borderRadius="md"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
            >
                <Icon as={icon} boxSize={{ base: 6, md: 7 }} color="teal.300" />
            </Box>

            <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="medium"
                color="gray.300"
                whiteSpace="normal"
                wordBreak="break-word"
                flex="1 1 auto"
            >
                {label}
            </Text>
        </Flex>

        <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="white"
            mb={1}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
        >
            {value}
        </Text>

        {helpText && (
            <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.400"
                whiteSpace="normal"
                wordBreak="break-word"
            >
                {helpText}
            </Text>
        )}
    </MotionBox>
);
