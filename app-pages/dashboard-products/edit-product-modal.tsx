'use client'

import {
    Dialog,
    Checkbox,
    Button,
    Flex,
    Stack,
    Input,
    Textarea,
    Spinner,
    Heading,
    IconButton,
    HStack,
    Box,
    Text,
    Separator,
    Image,
} from '@chakra-ui/react'
import {useSearchParams, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {getProductById, updateProduct, getCategories} from './actions'
import {FaTrash} from 'react-icons/fa'
import {useForm, useFieldArray, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {productSchema, ProductFormValues} from "@/app-pages/dashboard-products/validation";
import {PortionPrice} from "@/models/product";
import {CategoryType} from "@/models/category";

type EditProductModalProps = {
    refetch: VoidFunction
}

export const EditProductModal = ({refetch}: EditProductModalProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isDragOver, setIsDragOver] = useState(false)


    const productId = searchParams.get('edit')
    const isOpen = !!productId

    const {data: product, isLoading} = useQuery({
        queryKey: ['product', productId],
        queryFn: () => productId ? getProductById(productId) : null,
        enabled: isOpen,
    })

    const {data: allCategories = []} = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        getValues
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            prices: [{size: '', price: 0}],
            categories: [],
            hidden: false,
        },
    })

    const {fields, append, remove} = useFieldArray({
        control,
        name: 'prices',
    })

    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (product) {
            reset({
                name: product.name ?? '',
                description: product.description ?? '',
                prices: product.prices?.length
                    ? product.prices.map((price: PortionPrice) => ({...price}))
                    : [{size: '', price: 0}],
                categories: product.categories?.map(({_id}: CategoryType) => _id) || [],
                hidden: product.hidden || false,
            })
        }
    }, [product, reset])

    const {mutateAsync, isPending} = useMutation({
        mutationFn: (formData: FormData) => {
            console.log(productId);
            console.log(formData);
            return updateProduct(productId!, formData);
        },
        onSuccess: () => {
            refetch();
            handleClose()
        },
    })

    const handleClose = () => {
        const params = new URLSearchParams(window.location.search)
        params.delete('edit')
        router.push(`?${params.toString()}`, {scroll: false})
    }

    const onSubmit = async () => {
        const values = getValues();

        const formData = new FormData()
        const formattedData = {
            ...values,
            prices: values.prices.map(p => ({
                ...p,
                price: parseFloat(String(p.price).replace(',', '.')) || 0
            }))
        }

        Object.entries(formattedData).forEach(([key, value]) => {
            if (key === 'categories' || key === 'prices') {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value as string)
            }
        })

        if (imageFile) formData.append('image', imageFile)

        await mutateAsync(formData)
    }

    const cardBg = 'rgba(20, 20, 25, 0.9)'
    const inputBg = 'rgba(30, 30, 35, 0.9)'

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Backdrop bg="blackAlpha.800" backdropFilter="blur(6px)"/>
            <Dialog.Positioner>
                <Dialog.Content
                    bg={cardBg}
                    borderRadius="xl"
                    shadow="xl"
                    border="1px solid"
                    borderColor="teal.600"
                    color="white"
                    maxW="3xl"
                    w="full"
                    backdropFilter="blur(14px)"
                    transition="all 0.25s ease"
                >
                    <Dialog.Header borderBottom="1px solid" borderColor="gray.700">
                        <Flex justify="space-between" align="center" p={4}>
                            <Heading
                                size="md"
                                bgGradient="linear(to-r, teal.200, cyan.400)"
                                bgClip="text"
                                color="teal.200"
                                textShadow="0 0 8px rgba(56,178,172,0.4)"
                                fontWeight="normal"
                            >
                                Редактирование товара
                            </Heading>
                            <Dialog.CloseTrigger asChild>
                                <Button
                                    variant="ghost"
                                    colorScheme="gray"
                                    size="xs"
                                    color="gray.400"
                                    _hover={{bg: 'gray.700', color: 'teal.200'}}
                                >
                                    ✕
                                </Button>
                            </Dialog.CloseTrigger>
                        </Flex>
                    </Dialog.Header>

                    <Dialog.Body p={6}>
                        {isLoading ? (
                            <Flex justify="center" py={10}>
                                <Spinner size="lg" color="teal.300"/>
                            </Flex>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack gap={5}>
                                    {/* Название */}
                                    <Box>
                                        <Heading mb={1} size="sm" color="teal.200">
                                            Название
                                        </Heading>
                                        <Input
                                            {...register('name')}
                                            placeholder="Введите название"
                                            bg={inputBg}
                                            border="1px solid"
                                            borderColor="gray.600"
                                            _focus={{borderColor: 'teal.400', boxShadow: '0 0 6px teal'}}
                                            h="36px"
                                            fontSize="sm"
                                        />
                                        {errors.name && (
                                            <Text color="red.400" mt={1} fontSize="xs">
                                                {errors.name.message}
                                            </Text>
                                        )}
                                    </Box>

                                    {/* Описание */}
                                    <Box>
                                        <Heading mb={1} size="sm" color="teal.200">
                                            Описание
                                        </Heading>
                                        <Textarea
                                            {...register('description')}
                                            placeholder="Краткое описание товара"
                                            bg={inputBg}
                                            border="1px solid"
                                            borderColor="gray.600"
                                            minH="80px"
                                            _focus={{borderColor: 'teal.400', boxShadow: '0 0 6px teal'}}
                                            fontSize="sm"
                                            p={2}
                                        />
                                        {errors.description && (
                                            <Text color="red.400" mt={1} fontSize="xs">
                                                {errors.description.message}
                                            </Text>
                                        )}
                                    </Box>

                                    <Separator borderColor="gray.700"/>

                                    <Box>
                                        <Heading size="sm" mb={2} color="teal.200">
                                            Изображение
                                        </Heading>
                                        <Box
                                            border="2px dashed"
                                            borderColor={imageFile ? 'teal.400' : 'gray.600'}
                                            borderRadius="md"
                                            p={4}
                                            textAlign="center"
                                            bg={isDragOver ? 'rgba(45,212,191,0.1)' : 'rgba(40,40,45,0.6)'}
                                            cursor="pointer"
                                            transition="all 0.2s ease"
                                            onClick={() => document.getElementById('product-image-input')?.click()}
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                setIsDragOver(true)
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault()
                                                setIsDragOver(false)
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                setIsDragOver(false)
                                                const file = e.dataTransfer.files[0]
                                                if (file) setImageFile(file)
                                            }}
                                        >
                                            {imageFile ? (
                                                <Image
                                                    src={URL.createObjectURL(imageFile)}
                                                    alt="preview"
                                                    borderRadius="md"
                                                    maxH="160px"
                                                    objectFit="cover"
                                                    mb={2}
                                                />
                                            ) : (
                                                <Text color="gray.400" fontSize="sm">
                                                    Перетащите файл сюда или нажмите для выбора
                                                </Text>
                                            )}
                                        </Box>
                                        <Input
                                            id="product-image-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) setImageFile(file)
                                            }}
                                            display="none"
                                        />
                                    </Box>

                                    <Box>
                                        <Heading size="sm" mb={2} color="teal.200">
                                            Цены
                                        </Heading>
                                        <Stack gap={3}>
                                            {fields.map((field, idx) => (
                                                <HStack
                                                    key={field.id}
                                                    bg={inputBg}
                                                    p={3}
                                                    borderRadius="md"
                                                    border="1px solid"
                                                    borderColor="gray.600"
                                                    _hover={{borderColor: 'teal.400'}}
                                                >
                                                    <Input
                                                        {...register(`prices.${idx}.size`)}
                                                        p={2}
                                                        placeholder="Размер"
                                                        bg="gray.800"
                                                        fontSize="sm"
                                                        h="32px"
                                                    />
                                                    <Input
                                                        {...register(`prices.${idx}.price`, {
                                                            setValueAs: (v) => {
                                                                if (typeof v === 'string') {
                                                                    return parseFloat(v.replace(',', '.')) || 0
                                                                }
                                                                return v
                                                            },
                                                        })}
                                                        p={2}
                                                        placeholder="Цена"
                                                        type="text"
                                                        bg="gray.800"
                                                        fontSize="sm"
                                                        h="32px"
                                                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                                            const input = e.currentTarget
                                                            input.value = input.value.replace(/[^0-9.,]/g, '')
                                                        }}
                                                    />

                                                    <IconButton
                                                        aria-label="Удалить"
                                                        color="red.400"
                                                        size="xs"
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        onClick={() => remove(idx)}
                                                    >
                                                        <FaTrash/>
                                                    </IconButton>
                                                </HStack>
                                            ))}
                                            <Button
                                                size="xs"
                                                variant="solid"
                                                bg="teal.700"
                                                color="white"
                                                _hover={{
                                                    bg: 'teal.600',
                                                    boxShadow: '0 0 6px rgba(56,178,172,0.6)',
                                                }}
                                                _active={{bg: 'teal.800'}}
                                                onClick={() => append({size: '', price: 0})}
                                            >
                                                Добавить цену
                                            </Button>
                                        </Stack>
                                    </Box>

                                    <Box>
                                        <Heading size="sm" mb={2} color="teal.200">
                                            Категории
                                        </Heading>
                                        <Flex wrap="wrap" gap={2}>
                                            {allCategories.map(({_id, name}: CategoryType) => {
                                                const id = _id.toString()
                                                return (
                                                    <Controller
                                                        key={id}
                                                        name="categories"
                                                        control={control}
                                                        render={({field}) => {
                                                            const isChecked = field.value.includes(id)
                                                            return (
                                                                <Checkbox.Root
                                                                    id={`cat-${id}`}
                                                                    checked={isChecked}
                                                                    onCheckedChange={() => {
                                                                        if (isChecked) {
                                                                            field.onChange(field.value.filter((v: string) => v !== id))
                                                                        } else {
                                                                            field.onChange([...field.value, id])
                                                                        }
                                                                    }}
                                                                >
                                                                    <Checkbox.HiddenInput/>
                                                                    <Flex
                                                                        align="center"
                                                                        px={3}
                                                                        py={1}
                                                                        borderRadius="full"
                                                                        border="1px solid"
                                                                        borderColor={isChecked ? 'teal.400' : 'gray.600'}
                                                                        bg={isChecked ? 'teal.700' : 'transparent'}
                                                                        color={isChecked ? 'teal.100' : 'gray.300'}
                                                                        fontWeight="medium"
                                                                        fontSize="xs"
                                                                        cursor="pointer"
                                                                        transition="all 0.2s ease"
                                                                        _hover={{
                                                                            borderColor: 'teal.300',
                                                                            bg: isChecked ? 'teal.600' : 'gray.800',
                                                                        }}
                                                                        _active={{transform: 'scale(0.97)'}}
                                                                    >
                                                                        <Checkbox.Control display="none"/>
                                                                        <Checkbox.Label cursor="pointer">
                                                                            {name}
                                                                        </Checkbox.Label>
                                                                    </Flex>
                                                                </Checkbox.Root>
                                                            )
                                                        }}
                                                    />
                                                )
                                            })}
                                        </Flex>
                                    </Box>

                                    <Controller
                                        name="hidden"
                                        control={control}
                                        render={({field}) => {
                                            const isChecked = !!field.value
                                            return (
                                                <Checkbox.Root
                                                    id="hidden"
                                                    checked={isChecked}
                                                    onCheckedChange={(value) => {
                                                        const checked =
                                                            typeof value === 'boolean' ? value : value?.checked
                                                        field.onChange(checked)
                                                    }}
                                                >
                                                    <Checkbox.HiddenInput/>
                                                    <Flex align="center" gap={2} cursor="pointer" userSelect="none">
                                                        <Text
                                                            color={isChecked ? 'teal.100' : 'gray.300'}
                                                            fontWeight="500"
                                                            fontSize="sm"
                                                        >
                                                            Скрыт
                                                        </Text>
                                                        <Box
                                                            role="switch"
                                                            aria-checked={isChecked}
                                                            tabIndex={0}
                                                            w="38px"
                                                            h="20px"
                                                            borderRadius="full"
                                                            px="2px"
                                                            display="flex"
                                                            alignItems="center"
                                                            bg={isChecked ? 'rgba(45,212,191,0.08)' : 'transparent'}
                                                            border="1px solid"
                                                            borderColor={isChecked ? 'teal.300' : 'gray.600'}
                                                            transition="all 180ms ease"
                                                            _hover={{borderColor: 'teal.300'}}
                                                        >
                                                            <Box
                                                                w="14px"
                                                                h="14px"
                                                                borderRadius="full"
                                                                bg={isChecked ? 'teal.300' : 'gray.400'}
                                                                transform={
                                                                    isChecked
                                                                        ? 'translateX(16px)'
                                                                        : 'translateX(0px)'
                                                                }
                                                                transition="all 180ms ease"
                                                                boxShadow={
                                                                    isChecked
                                                                        ? '0 3px 8px rgba(56,178,172,0.18)'
                                                                        : 'none'
                                                                }
                                                            />
                                                        </Box>
                                                    </Flex>
                                                </Checkbox.Root>
                                            )
                                        }}
                                    />
                                </Stack>

                                <Dialog.Footer
                                    borderTop="1px solid"
                                    borderColor="gray.700"
                                    mt={6}
                                    pt={3}
                                    gap={3}
                                >
                                    <Button
                                        p={2}
                                        variant="outline"
                                        size="sm"
                                        color="gray.300"
                                        borderColor="gray.600"
                                        _hover={{
                                            bg: 'gray.800',
                                            borderColor: 'teal.400',
                                            color: 'teal.200',
                                        }}
                                        _active={{bg: 'gray.700'}}
                                        onClick={handleClose}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        p={2}
                                        colorScheme="teal"
                                        size="sm"
                                        bg="teal.500"
                                        color="white"
                                        _hover={{
                                            bg: 'teal.400',
                                            boxShadow: '0 0 10px rgba(56,178,172,0.5)',
                                        }}
                                        _active={{bg: 'teal.600'}}
                                        type="submit"
                                        loading={isSubmitting || isPending}
                                    >
                                        Сохранить
                                    </Button>
                                </Dialog.Footer>
                            </form>
                        )}
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
