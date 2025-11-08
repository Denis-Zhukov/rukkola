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
    Skeleton,
    SkeletonText,
    IconButton
} from '@chakra-ui/react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {useSearchParams, useRouter} from 'next/navigation'
import {useState} from 'react'
import {FaEye, FaEyeSlash, FaEdit, FaTrash} from 'react-icons/fa'
import {deleteProduct, getProducts, toggleProductVisibility /*, deleteProduct (optional) */} from './actions'
import {Tooltip} from "@/components/tooltip";

const navButtonStyles = {
    size: 'xs',
    bg: 'teal.500',
    color: 'white',
    _hover: {bg: 'teal.600'},
    _active: {bg: 'teal.700', transform: 'scale(0.95)'},
    borderRadius: 'full',
    minW: '36px',
    minH: '36px',
    boxShadow: 'md',
    p: '2',
} as const

export const ProductsPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const currentPage = Number(searchParams.get('page')) || 1
    const page = Math.max(currentPage, 1)

    const {data, isFetching} = useQuery({
        queryKey: ['products', page],
        queryFn: () => getProducts(page, 10),
        placeholderData: (prev) => prev
    })

    const {products, totalPages} = data ?? {products: [], totalPages: 1}

    const setPageParam = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', String(newPage))
        router.push(`?${params.toString()}`, {scroll: false})
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

    const toggleVisibilityMutation = useMutation({
        mutationFn: (productId: string) => toggleProductVisibility(productId),
        onMutate: (productId) => {
            setLoadingId(productId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products', page]})
        },
        onSettled: () => {
            setLoadingId(null)
        },
    })

    const handleToggleVisibility = (productId: string) => {
        toggleVisibilityMutation.mutate(productId)
    }

    const deleteMutation = useMutation({
        mutationFn: (productId: string) => deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', page] });
        },
    });

    const handleDelete = async (productId: string) => {
        const confirmed = confirm('Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.')
        if (!confirmed) return
        try {
            await deleteMutation.mutateAsync(productId)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Box minH="100vh">
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
                    py={2}
                    textAlign="center"
                    color="white"
                >
                    <Heading size="md" fontWeight="semibold">
                        Список товаров
                    </Heading>
                </Card.Header>

                <Card.Body px={0} py={0}>
                    <Box overflowX="auto" position="relative">
                        {isFetching && (
                            <Flex
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                justify="center"
                                align="center"
                                bg="rgba(0,0,0,0.25)"
                                zIndex={10}
                            >
                                <Spinner size="xl" color="teal.400"/>
                            </Flex>
                        )}

                        <Table.Root size="md" variant="outline" w="100%">
                            <Table.Header bg="gray.800">
                                <Table.Row>
                                    <Table.ColumnHeader color="gray.200" minW="100px" p={4}>
                                        Фото
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="200px" p={4}>
                                        Название
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="350px" p={4}>
                                        Описание
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="180px" p={4}>
                                        Цены
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="200px" p={4}>
                                        Категории
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color="gray.200" minW="200px" p={4}>
                                        Действия
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {products.length > 0 ? (
                                    products.map((p: any) => (
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
                                            <Table.Cell p={4}>
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

                                            <Table.Cell fontWeight="semibold" color="teal.400" p={4}>
                                                {p.name}
                                            </Table.Cell>

                                            <Table.Cell maxW="450px" whiteSpace="normal" color="gray.300" p={4}>
                                                {p.description || '—'}
                                            </Table.Cell>

                                            <Table.Cell p={4}>
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

                                            <Table.Cell p={4}>
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

                                            <Table.Cell p={4}>

                                                <Flex gap={2} align="center" whiteSpace="nowrap">
                                                    <Tooltip
                                                        content={p.hidden ? "Сейчас товар скрыт" : "Сейчас товар отображается"}
                                                        openDelay={400}>
                                                        <Button
                                                            size="sm"
                                                            borderRadius="xl"
                                                            bgGradient={p.hidden ? 'linear(to-r, orange.400, orange.500)' : 'linear(to-r, teal.400, teal.500)'}
                                                            color="white"
                                                            px={4}
                                                            py={2}
                                                            fontSize="sm"
                                                            fontWeight="semibold"
                                                            _hover={{
                                                                transform: 'scale(1.05)',
                                                                bgGradient: p.hidden ? 'linear(to-r, orange.500, orange.600)' : 'linear(to-r, teal.500, teal.600)',
                                                            }}
                                                            _active={{transform: 'scale(0.97)'}}
                                                            loading={loadingId === p._id}
                                                            onClick={() => handleToggleVisibility(p._id)}
                                                            flexShrink={0}
                                                        >
                                                            {p.hidden ? <FaEye/> :
                                                                <FaEyeSlash/>}{p.hidden ? 'Показать' : 'Скрыть'}
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip content="Редактировать" openDelay={400}>
                                                        <IconButton
                                                            aria-label="Редактировать"
                                                            size="sm"
                                                            borderRadius="xl"
                                                            bgGradient="linear(to-r, blue.400, blue.500)"
                                                            color="white"
                                                            px={3}
                                                            py={2}
                                                            _hover={{
                                                                transform: 'scale(1.1)',
                                                                bgGradient: 'linear(to-r, blue.500, blue.600)'
                                                            }}
                                                            onClick={() => router.push(`/products/edit/${p._id}`)}
                                                            flexShrink={0}><FaEdit/></IconButton>
                                                    </Tooltip>

                                                    <Tooltip content="Удалить" openDelay={400}>
                                                        <IconButton
                                                            aria-label="Удалить"
                                                            size="sm"
                                                            borderRadius="xl"
                                                            bgGradient="linear(to-r, red.500, red.600)"
                                                            color="white"
                                                            px={3}
                                                            py={2}
                                                            _hover={{
                                                                transform: 'scale(1.1)',
                                                                bgGradient: 'linear(to-r, red.600, red.700)'
                                                            }}
                                                            onClick={() => handleDelete(p._id)}
                                                            loading={deleteMutation.isPending && deleteMutation.variables === p._id}
                                                            flexShrink={0}><FaTrash/></IconButton>
                                                    </Tooltip>
                                                </Flex>
                                            </Table.Cell>

                                        </Table.Row>
                                    ))
                                ) : (
                                    Array.from({length: 10}).map((_, idx) => (
                                        <Table.Row
                                            key={`skeleton-${idx}`}
                                            bg="gray.900"
                                            borderBottom="1px solid"
                                            borderColor="gray.800"
                                        >
                                            <Table.Cell>
                                                <Skeleton boxSize="60px" borderRadius="md"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <SkeletonText noOfLines={1} width="100px"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <SkeletonText noOfLines={2} width="250px"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <SkeletonText noOfLines={2} width="150px"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <SkeletonText noOfLines={1} width="120px"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <SkeletonText noOfLines={1} width="100px"/>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card.Body>

                <Card.Footer p={5} borderTop="1px solid" borderColor="gray.800">
                    <Flex justify="center" align="center" gap={2} flexWrap="wrap">
                        <Button
                            onClick={() => setPageParam(Math.max(1, page - 1))}
                            disabled={page === 1}
                            {...navButtonStyles}
                            _disabled={{opacity: 0.4, cursor: 'not-allowed'}}
                        >
                            <Text fontSize="lg">←</Text> Назад
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
                                    _hover={{bg: 'teal.600', color: 'white', transform: 'scale(1.05)'}}
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
                            onClick={() => setPageParam(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            {...navButtonStyles}
                            _disabled={{opacity: 0.4, cursor: 'not-allowed'}}
                        >
                            Вперёд <Text fontSize="lg">→</Text>
                        </Button>
                    </Flex>
                </Card.Footer>
            </Card.Root>
        </Box>
    )
}
