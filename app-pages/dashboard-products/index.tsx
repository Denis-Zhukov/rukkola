'use client'

import {Box, Flex, Spinner, Table, Heading, Card} from '@chakra-ui/react'
import {useQuery, useMutation} from '@tanstack/react-query'
import {useSearchParams, useRouter} from 'next/navigation'
import {useState} from 'react'
import {deleteProduct, getProducts, toggleProductVisibility} from './actions'
import {ProductRow} from './product-row'
import {Pagination} from './pagination'
import {EditProductModal} from "@/app-pages/dashboard-products/edit-product-modal";
import {ProductType} from "@/models/product";
import {SkeletonRows} from "@/app-pages/dashboard-products/skeleton-rows";

export const ProductsPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [deletePending, setDeletePending] = useState<string | null>(null)

    const page = Math.max(Number(searchParams.get('page')) || 1, 1)

    const {data, isFetching, isPending, refetch} = useQuery({
        queryKey: ['products', page],
        queryFn: () => getProducts(page, 10),
        placeholderData: (prev) => prev,
    })

    const {products = [], totalPages = 1} = data ?? {}

    const setPageParam = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', String(newPage))
        router.push(`?${params.toString()}`, {scroll: false})
    }

    const toggleVisibility = useMutation({
        mutationFn: toggleProductVisibility,
        onMutate: (id) => setLoadingId(id),
        onSuccess: async () => {
            await refetch();
        },
        onSettled: () => setLoadingId(null),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onMutate: (id) => setDeletePending(id),
        onSuccess: async () => {
            await refetch();
        },
        onSettled: () => setDeletePending(null),
    })

    return (
        <Box minH="100vh">
            <EditProductModal refetch={refetch}/>

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
                                    {['Фото', 'Название', 'Описание', 'Цены', 'Категории', 'Действия'].map(
                                        (col) => (
                                            <Table.ColumnHeader
                                                key={col}
                                                minW={col === 'Фото' ? undefined : 200}
                                                color="gray.200"
                                                p={4}
                                            >
                                                {col}
                                            </Table.ColumnHeader>
                                        ),
                                    )}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {products.map((product: ProductType) => (
                                    <ProductRow
                                        key={product._id}
                                        p={product}
                                        router={router}
                                        onToggle={(id: string) => toggleVisibility.mutate(id)}
                                        onDelete={(id: string) => {
                                            if (confirm('Удалить товар?')) deleteMutation.mutate(id)
                                        }}
                                        loadingId={loadingId}
                                        deletePending={deletePending}
                                    />
                                ))}
                            </Table.Body>
                            {!products?.length && isPending && <SkeletonRows/>}
                        </Table.Root>
                    </Box>
                </Card.Body>

                <Card.Footer p={5} borderTop="1px solid" borderColor="gray.800">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPageParam}
                    />
                </Card.Footer>
            </Card.Root>
        </Box>
    )
}
