'use client'

import {Box, Text, VStack, HStack, Link, Icon, Separator} from '@chakra-ui/react'
import {MapPin, Send, Phone, Heart, ArrowUpRight} from 'lucide-react'
import {ElementType} from 'react'

const MAPS_URL = 'https://yandex.by/maps/-/CTBXjY4t'
const INSTAGRAM_URL = 'https://www.instagram.com/p/DaiMK9RNHmP/'
const TELEGRAM_URL = 'https://t.me/ZhukovLabs'
const PHONE_DISPLAY = '+375 (25) 615-66-07'
const PHONE_LINK = 'tel:+375256156607'

type ContactItemProps = {
    icon: ElementType
    label: string
    href: string
    value: string
    external?: boolean
    muted?: boolean
}

const ContactItem = ({icon, label, href, value, external, muted}: ContactItemProps) => (
    <HStack gap={2.5} align="center" minW={0}>
        <Box
            p={muted ? 0 : 2}
            borderRadius="12px"
            bg={muted ? 'transparent' : 'whiteAlpha.100'}
            color={muted ? 'gray.600' : 'gray.200'}
            flexShrink={0}
        >
            <Icon as={icon} boxSize={muted ? 3.5 : 4}/>
        </Box>
        <Box minW={0}>
            {!muted && (
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.06em">
                    {label}
                </Text>
            )}
            <Link
                href={href}
                color={muted ? 'gray.500' : 'gray.100'}
                fontWeight={muted ? '400' : '600'}
                fontSize={muted ? 'xs' : 'sm'}
                display="inline-flex"
                alignItems="center"
                gap={1}
                _hover={{color: muted ? 'gray.400' : 'white'}}
                {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                wordBreak="break-word"
            >
                {muted && `${label}: `}
                {value}
                {external && <Icon as={ArrowUpRight} boxSize={3} opacity={0.6}/>}
            </Link>
        </Box>
    </HStack>
)

export function ClosureNotice() {
    return (
        <Box
            w="full"
            position="relative"
            borderRadius={{base: '20px', md: '28px'}}
            overflow="hidden"
            bgGradient="linear(to-br, rgba(30,12,12,0.95), rgba(15,12,15,0.95))"
            backdropFilter="blur(16px) saturate(160%)"
            border="1px solid rgba(255,255,255,0.1)"
            boxShadow="0 24px 48px -16px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.08)"
            role="alertdialog"
            aria-label="Кафе Руккола закрылось"
        >
            <Box
                h="4px"
                bgGradient="linear(to-r, red.400, orange.300, red.400)"
                w="full"
            />

            <VStack align="stretch" gap={5} p={{base: 6, md: 9}} maxW="720px" mx="auto">
                <HStack gap={3} align="center">
                    <Box
                        p={2.5}
                        borderRadius="14px"
                        bg="rgba(248,113,113,0.12)"
                        color="red.300"
                        flexShrink={0}
                    >
                        <Heart size={22}/>
                    </Box>
                    <Text
                        color="white"
                        fontSize={{base: 'xl', md: '2xl'}}
                        fontWeight="extrabold"
                        letterSpacing="-0.02em"
                    >
                        Кафе «Руккола» закрывается
                    </Text>
                </HStack>

                <Text color="gray.300" fontSize={{base: 'sm', md: 'md'}} lineHeight="1.7">
                    Дорогие гости! С тяжёлым сердцем и бесконечной благодарностью сообщаем: кафе
                    «Руккола» закрывается.
                </Text>

                <Text color="gray.300" fontSize={{base: 'sm', md: 'md'}} lineHeight="1.7">
                    Мы верим, что «Руккола» обязательно вернётся в новом месте. Спасибо, что были с
                    нами всё это время — с вами было по-настоящему хорошо. До тёплых встреч!
                </Text>

                <Text color="gray.400" fontSize="sm" fontStyle="italic">
                    С любовью, «Руккола» 🤍
                </Text>

                <Link
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="gray.400"
                    fontSize="xs"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    _hover={{color: 'gray.200'}}
                    alignSelf="flex-start"
                >
                    Оригинал поста в Instagram
                    <Icon as={ArrowUpRight} boxSize={3} opacity={0.6}/>
                </Link>

                <Separator my={1} borderColor="rgba(255,255,255,0.08)"/>

                <VStack align="stretch" gap={3}>
                    <Text color="white" fontSize="md" fontWeight="700">
                        А пока ждём вас в нашем ресторане{' '}
                        <Text as="span" color="orange.300">La Salute</Text>
                    </Text>

                    <HStack gap={2} align="center" flexWrap="wrap">
                        <Box
                            p={2}
                            borderRadius="12px"
                            bg="whiteAlpha.100"
                            color="orange.300"
                            flexShrink={0}
                        >
                            <Icon as={MapPin} boxSize={4}/>
                        </Box>
                        <Text color="gray.300" fontSize="sm" lineHeight="1.6">
                            Рогачёвская улица, 4, Гомель, 246003
                        </Text>
                    </HStack>

                    <Link
                        href={MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        h="46px"
                        w="full"
                        bg="white"
                        color="black"
                        fontSize="14px"
                        fontWeight="700"
                        borderRadius="16px"
                        _hover={{bg: 'whiteAlpha.900', transform: 'translateY(-1px)'}}
                        _active={{bg: 'whiteAlpha.800', transform: 'translateY(0)'}}
                        transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                        boxShadow="0 8px 20px -6px rgba(255,255,255,0.2)"
                    >
                        <MapPin size={16}/>
                        Открыть на Яндекс.Картах
                    </Link>
                </VStack>

                <Separator my={1} borderColor="rgba(255,255,255,0.08)"/>

                <Box
                    px={4}
                    py={3}
                    borderRadius="12px"
                    bg="rgba(251,191,36,0.08)"
                    border="1px solid rgba(251,191,36,0.2)"
                >
                    <Text color="yellow.200" fontSize="sm" fontWeight="600">
                        В ближайшее время этот сайт также перестанет работать.
                    </Text>
                </Box>

                <VStack align="stretch" gap={2} pt={1} opacity={0.7}>
                    <Text fontSize="2xs" color="gray.600">
                        Для сотрудничества, разработки или продления работы сайта
                    </Text>
                    <VStack align="stretch" gap={1.5}>
                        <ContactItem
                            icon={Send}
                            label="Telegram"
                            href={TELEGRAM_URL}
                            value="@ZhukovLabs"
                            external
                            muted
                        />
                        <ContactItem
                            icon={Phone}
                            label="Телефон"
                            href={PHONE_LINK}
                            value={PHONE_DISPLAY}
                            muted
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    )
}
