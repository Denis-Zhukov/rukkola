'use client'

import {
    Box,
    Button,
    Flex,
    Spinner,
    Text,
    Image,
    Table,
    Heading,
    Card,
    Stack,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { getProducts } from './actions'

export const ProductsPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentPage = Number(searchParams.get('page')) || 1
    const page = Math.max(currentPage, 1)

    const { data, isFetching } = useQuery({
        queryKey: ['products', page],
        queryFn: () => getProducts(page, 10),
        placeholderData: (prev) => prev
    })

    const { products, totalPages } = data ?? { products: [], totalPages: 1 }

    const setPageParam = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', String(newPage))
        router.push(`?${params.toString()}`)
    }

    const generatePages = () => {
        const pages: (number | string)[] = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (page <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages)
            } else if (page >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
            }
        }

        return pages
    }

    const pagesToRender = generatePages()

    return (
        <Box bg="black" minH="100vh" py={12} px={6}>
            <Card.Root
                w="100%"
                borderRadius="2xl"
                shadow="xl"
                border="1px solid"
                borderColor="gray.700"
                bg="gray.900"
            >
                <Card.Header
                    bg="teal.500"
                    borderTopRadius="2xl"
                    py={4}
                    textAlign="center"
                    color="white"
                >
                    <Heading size="md" fontWeight="semibold">
                        Список товаров
                    </Heading>
                </Card.Header>

                {/* Таблица */}
                <Card.Body px={0} py={0}>
                    <Box overflowX="auto" position="relative">
                        {/* Показать спиннер поверх таблицы при обновлении данных */}
                        {isFetching && (
                            <Flex
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                justify="center"
                                align="center"
                                bg="rgba(0,0,0,0.4)"
                                zIndex={10}
                            >
                                <Spinner size="xl" color="teal.400" />
                            </Flex>
                        )}

                        <Table.Root size="md" variant="outline" w="100%">
                            <Table.Header bg="gray.800">
                                <Table.Row>
                                    <Table.ColumnHeader color="gray.200" minW="100px">
                                        Фото
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="200px">
                                        Название
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="350px">
                                        Описание
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="180px">
                                        Цены
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="200px">
                                        Категории
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {products.map((p: any) => (
                                    <Table.Row
                                        key={p._id}
                                        bg="gray.900"
                                        borderBottom="1px solid"
                                        borderColor="gray.800"
                                        _hover={{
                                            bg: 'gray.800',
                                            transition: '0.2s ease',
                                        }}
                                    >
                                        <Table.Cell>
                                            <Image
                                                src={p.image || '/placeholder.png'}
                                                alt={p.name}
                                                boxSize="60px"
                                                borderRadius="md"
                                                objectFit="cover"
                                                border="1px solid"
                                                borderColor="gray.700"
                                            />
                                        </Table.Cell>

                                        <Table.Cell fontWeight="semibold" color="teal.400">
                                            {p.name}
                                        </Table.Cell>

                                        <Table.Cell
                                            maxW="450px"
                                            whiteSpace="normal"
                                            color="gray.300"
                                        >
                                            {p.description || '—'}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {p.prices?.length ? (
                                                <Stack gap={1} fontSize="sm">
                                                    {p.prices.map((price: any) => (
                                                        <Flex
                                                            key={price.size}
                                                            justify="space-between"
                                                            borderBottom="1px dashed"
                                                            borderColor="gray.700"
                                                            pb="1"
                                                        >
                                                            <Text color="gray.400">{price.size}</Text>
                                                            <Text color="teal.400" fontWeight="semibold">
                                                                {price.price} ₽
                                                            </Text>
                                                        </Flex>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Text color="gray.500">нет данных</Text>
                                            )}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {p.categories?.length ? (
                                                <Flex wrap="wrap" gap={1}>
                                                    {p.categories.map((c: any) => (
                                                        <Box
                                                            key={c._id}
                                                            bg="gray.700"
                                                            color="gray.200"
                                                            px={2}
                                                            py={0.5}
                                                            borderRadius="md"
                                                            fontSize="sm"
                                                        >
                                                            {c.name}
                                                        </Box>
                                                    ))}
                                                </Flex>
                                            ) : (
                                                <Text color="gray.500">—</Text>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card.Body>

                {/* Пагинация */}
                <Card.Footer py={5} borderTop="1px solid" borderColor="gray.800">
                    <Flex justify="center" align="center" gap={2} flexWrap="wrap">
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            onClick={() => setPageParam(Math.max(1, page - 1))}
                            disabled={page === 1}
                            _disabled={{ opacity: 0.4 }}
                        >
                            Назад
                        </Button>

                        {pagesToRender.map((pNum, idx) =>
                            pNum === '...' ? (
                                <Text key={`dots-${idx}`} color="gray.500" px={2}>
                                    ...
                                </Text>
                            ) : (
                                <Button
                                    key={pNum}
                                    size="sm"
                                    onClick={() => setPageParam(Number(pNum))}
                                    bg={pNum === page ? 'teal.500' : 'gray.800'}
                                    color={pNum === page ? 'white' : 'gray.300'}
                                    _hover={{ bg: 'teal.600', color: 'white', transform: 'scale(1.05)' }}
                                    border="1px solid"
                                    borderColor={pNum === page ? 'teal.500' : 'gray.700'}
                                    borderRadius="full"
                                    minW="36px"
                                    minH="36px"
                                >
                                    {pNum}
                                </Button>
                            )
                        )}

                        <Button
                            colorScheme="teal"
                            variant="outline"
                            onClick={() => setPageParam(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            _disabled={{ opacity: 0.4 }}
                        >
                            Вперёд
                        </Button>
                    </Flex>
                </Card.Footer>
            </Card.Root>
        </Box>
    )
}
