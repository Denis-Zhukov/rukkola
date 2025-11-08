import {Button} from "@chakra-ui/react";
import {motion} from "framer-motion";

type NavItemProps = {
    id: string;
    title: string;
    isActive: boolean;
    onClick: (id: string) => void;
}

export const NavItem = ({id, title, isActive, onClick}: NavItemProps) => (
    <Button
        key={id}
        size="sm"
        px={6}
        py={3}
        variant="ghost"
        borderRadius="full"
        fontWeight="medium"
        color={isActive ? "teal.300" : "gray.200"}
        bg="transparent"
        transition="all 0.3s ease"
        _hover={{
            color: "teal.200",
            transform: "translateY(-2px)",
        }}
        _active={{
            color: "teal.100",
        }}
        position="relative"
        overflow="hidden"
        onClick={() => onClick(id)}
    >
        {title}

        {isActive && (
            <motion.div
                layoutId="active-pill"
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "full",
                    background: "linear-gradient(90deg, rgba(56,178,172,0.25), rgba(129,230,217,0.2))",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(56,178,172,0.3)",
                    boxShadow: "0 0 12px rgba(56,178,172,0.25)",
                    zIndex: -1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
            />
        )}
    </Button>
);
