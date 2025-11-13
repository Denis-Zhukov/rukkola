'use client'

import React, { useState, useTransition } from 'react'
import {
    Box,
    Button,
    Image,
    Text,
    VStack,
    SimpleGrid,
    Flex,
    Spinner
} from '@chakra-ui/react'
import { FiUpload, FiStar } from 'react-icons/fi'
import { toggleActiveLunch } from './actions'
import {useColorModeValue} from "@chakra-ui/color-mode";

type Lunch = {
    _id: string
    image: string
    active: boolean
}

export const LunchGallery = ({ initialLunches }: { initialLunches: Lunch[] }) => {
    const [lunches, setLunches] = useState(initialLunches)
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleUpload = async () => {
        if (!file) return
        setLoading(true)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/lunches/upload', { method: 'POST', body: formData })
            if (res.ok) {
                const data = await res.json()
                setLunches((prev) => [{ _id: data.id, image: data.image, active: false }, ...prev])
            }
        } finally {
            setLoading(false)
            setFile(null)
        }
    }

    const handleToggle = (id: string) => {
        startTransition(async () => {
            await toggleActiveLunch(id)
            setLunches((prev) =>
                prev.map((l) =>
                    l._id === id ? { ...l, active: !l.active } : { ...l, active: false }
                )
            )
        })
    }

    const borderColor = useColorModeValue('teal.600', 'teal.400')
    const hoverShadow = '0 0 12px rgba(56,178,172,0.3)'
    const activeShadow = '0 0 18px rgba(56,178,172,0.5)'

    return (
        <Box
            maxW="750px"
            mx="auto"
            mt={16}
            bgGradient="linear(to-br, blackAlpha.900, gray.900)"
            border="1px solid"
            borderColor="teal.800"
            rounded="2xl"
            p={8}
            boxShadow="0 0 25px rgba(56,178,172,0.15)"
        >
            <Text fontSize={['xl', '2xl']} fontWeight="bold" color="teal.300" mb={6}>
                Управление изображениями ланча
            </Text>

            <VStack gap={5} align="stretch">
                {/* Drag & Drop Upload */}
                <Box
                    border="2px dashed"
                    borderColor={file ? 'teal.400' : 'gray.600'}
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    bg={isDragOver ? 'rgba(45,212,191,0.1)' : 'rgba(40,40,45,0.6)'}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    onClick={() => document.getElementById('lunch-image-input')?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
                    onDrop={(e) => {
                        e.preventDefault()
                        setIsDragOver(false)
                        const droppedFile = e.dataTransfer.files[0]
                        if (droppedFile && droppedFile.type.startsWith('image/')) {
                            setFile(droppedFile)
                        }
                    }}
                >
                    <input
                        id="lunch-image-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />

                    {file ? (
                        <Flex direction="column" align="center" gap={2}>
                            <Image
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                borderRadius="md"
                                maxH="160px"
                                objectFit="cover"
                            />
                            {loading ? (
                                <Flex align="center" gap={2} color="teal.300">
                                    <Spinner size="xs" />
                                    <Text fontSize="xs">Загрузка...</Text>
                                </Flex>
                            ) : (
                                <Text fontSize="xs" color="gray.300">
                                    {file.name}
                                </Text>
                            )}
                        </Flex>
                    ) : (
                        <Text color="gray.400" fontSize="sm">
                            Перетащите файл сюда или нажмите для выбора
                        </Text>
                    )}
                </Box>

                <Button
                    colorScheme="teal"
                    onClick={handleUpload}
                    loading={loading}
                    loadingText="Загрузка..."
                    rounded="md"
                    px={6}
                    fontWeight="bold"
                    bgGradient="linear(to-r, teal.500, teal.300)"
                    _hover={{ bgGradient: 'linear(to-r, teal.400, teal.200)', transform: 'translateY(-1px)', boxShadow: hoverShadow }}
                    _active={{ transform: 'scale(0.97)' }}
                >
                    <FiUpload style={{ marginRight: 6 }} /> Загрузить
                </Button>

                {isPending && (
                    <Flex justify="center" align="center" py={4}>
                        <Spinner color="teal.400" />
                    </Flex>
                )}

                <SimpleGrid columns={[2, 3, 4]} gap={4} mt={4}>
                    {lunches.map((lunch) => (
                        <Box
                            key={lunch._id}
                            position="relative"
                            rounded="lg"
                            overflow="hidden"
                            border={lunch.active ? '2px solid teal' : '1px solid gray'}
                            boxShadow={lunch.active ? activeShadow : hoverShadow}
                            transition="all 0.25s ease"
                            cursor="pointer"
                            _hover={{ transform: 'scale(1.05)', boxShadow: activeShadow }}
                            onClick={() => handleToggle(lunch._id)}
                        >
                            <Image
                                src={lunch.image}
                                alt="lunch image"
                                objectFit="cover"
                                w="100%"
                                h="160px"
                                borderRadius="md"
                            />
                            {lunch.active && (
                                <Flex
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    bg="teal.500"
                                    p={1}
                                    rounded="full"
                                    align="center"
                                    justify="center"
                                    boxShadow="0 0 10px rgba(56,178,172,0.7)"
                                >
                                    <FiStar color="black" size={18} />
                                </Flex>
                            )}
                        </Box>
                    ))}
                </SimpleGrid>
            </VStack>
        </Box>
    )
}
