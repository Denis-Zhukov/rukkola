'use client';

import {Flex, Button, Icon} from "@chakra-ui/react";
import {FiChevronDown} from "react-icons/fi";
import {motion} from "framer-motion";

const MotionIcon = motion(Icon);
const MotionButton = motion(Button);

export const ScrollToFooterButton = () => {
    const handleClick = () => {
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    };

    return (
        <Flex
            direction="column"
            align="center"
            gap={{base: 3, md: 4}}
        >
            <MotionButton
                onClick={handleClick}
                px={{base: 6, md: 8}}
                py={5}
                fontSize={{base: "sm", md: "md"}}
                borderRadius="full"
                initial={{opacity: 0, y: -15}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
            >
                <MotionIcon
                    as={FiChevronDown}
                    boxSize={5}
                    animate={{y: [0, 3, 0]}}
                    transition={{
                        repeat: Infinity,
                        duration: 1.3,
                        ease: "easeInOut",
                    }}
                />
                Адрес, телефон, часы работы
                <MotionIcon
                    as={FiChevronDown}
                    boxSize={5}
                    animate={{y: [0, 3, 0]}}
                    transition={{
                        repeat: Infinity,
                        duration: 1.3,
                        ease: "easeInOut",
                        delay: 0.15,
                    }}
                />
            </MotionButton>
        </Flex>
    );
};
