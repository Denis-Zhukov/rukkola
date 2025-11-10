'use client'

import React, {useTransition, useState} from 'react'
import {
    Table,
    IconButton,
    Box,
    Text,
    Checkbox,
    Input,
} from '@chakra-ui/react'
import {FiArrowUp, FiArrowDown, FiEdit, FiTrash2} from 'react-icons/fi'
import {CategoryType} from '@/models/category'
import {toggleCategoryField, moveCategory, updateCategoryName, deleteCategory} from './actions'

type Props = { categories: CategoryType[] }

export default function CategoriesTable({categories}: Props) {
    const [isPending, startTransition] = useTransition()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [tempName, setTempName] = useState('')

    const handleToggle = (id: string, field: 'isMenuItem' | 'showGroupTitle') =>
        startTransition(() => toggleCategoryField(id, field))

    const handleMove = (id: string, dir: 'up' | 'down') =>
        startTransition(() => moveCategory(id, dir))

    const handleEditClick = (category: CategoryType) => {
        setEditingId(category._id.toString())
        setTempName(category.name)
    }

    const handleNameSubmit = async (id: string) => {
        if (!tempName.trim()) return
        startTransition(async () => {
            await updateCategoryName(id, tempName.trim())
            setEditingId(null)
        })
    }

    const groupedCategories = categories.reduce<Record<string, CategoryType[]>>(
        (acc, cat) => {
            const key = cat.parent ? cat.parent.toString() : 'root'
            if (!acc[key]) acc[key] = []
            acc[key].push(cat)
            return acc
        },
        {}
    )

    const renderRow = (category: CategoryType, depth = 0): React.ReactNode => {
        const childCategories = categories.filter(
            (c) => c.parent?.toString() === category._id.toString(),
        )

        const parentKey = category.parent ? category.parent.toString() : 'root'
        const group = groupedCategories[parentKey].sort((a, b) => a.order - b.order)
        const indexInGroup = group.findIndex((c) => c._id === category._id)
        const isFirst = indexInGroup === 0
        const isLast = indexInGroup === group.length - 1

        return (
            <React.Fragment key={category._id.toString()}>
                <Table.Row
                    _hover={{bg: 'gray.800', transition: 'background 0.2s ease'}}
                    bg={depth % 2 ? 'gray.900' : 'blackAlpha.900'}
                >
                    <Table.Cell px={2}>
                        <Box pl={depth * 8} display="flex" alignItems="center" gap={2}>
                            {depth > 0 && (
                                <Box
                                    borderLeft="2px dashed teal"
                                    height="20px"
                                    mr={1}
                                    opacity={0.6}
                                />
                            )}

                            {editingId === category._id.toString() ? (
                                <Input
                                    size="sm"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={() => handleNameSubmit(category._id.toString())}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleNameSubmit(category._id.toString())
                                        if (e.key === 'Escape') setEditingId(null)
                                    }}
                                    autoFocus
                                    bg="gray.700"
                                    color="teal.200"
                                />
                            ) : (
                                <>
                                    <Text fontWeight="medium" color="teal.200" flex={1}>
                                        {category.name}
                                    </Text>
                                    <IconButton
                                        aria-label="Edit name"
                                        size="xs"
                                        variant="ghost"
                                        color="teal.300"
                                        _hover={{bg: 'teal.600', color: 'black'}}
                                        onClick={() => handleEditClick(category)}>
                                        <FiEdit/>
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                        <Checkbox.Root
                            checked={category.isMenuItem}
                            onCheckedChange={() =>
                                handleToggle(category._id.toString(), 'isMenuItem')
                            }
                            disabled={isPending}
                        >
                            <Checkbox.HiddenInput/>
                            <Checkbox.Control
                                bg="gray.700"
                                borderColor="teal.500"
                                _checked={{
                                    bg: 'teal.500',
                                    borderColor: 'teal.300',
                                    boxShadow: '0 0 6px 1px rgba(56,178,172,0.6)',
                                }}
                            >
                                <Checkbox.Indicator color="black"/>
                            </Checkbox.Control>
                        </Checkbox.Root>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                        <Checkbox.Root
                            checked={category.showGroupTitle}
                            onCheckedChange={() =>
                                handleToggle(category._id.toString(), 'showGroupTitle')
                            }
                            disabled={isPending}
                        >
                            <Checkbox.HiddenInput/>
                            <Checkbox.Control
                                bg="gray.700"
                                borderColor="teal.500"
                                _checked={{
                                    bg: 'teal.500',
                                    borderColor: 'teal.300',
                                    boxShadow: '0 0 6px 1px rgba(56,178,172,0.6)',
                                }}
                            >
                                <Checkbox.Indicator color="black"/>
                            </Checkbox.Control>
                        </Checkbox.Root>
                    </Table.Cell>

                    <Table.Cell display="flex" gap={2} justifyContent="center">
                        <IconButton
                            aria-label="Move up"
                            color="teal.300"
                            variant="ghost"
                            size="sm"
                            _hover={{bg: 'teal.600', color: 'black', transform: 'translateY(-1px)'}}
                            _active={{bg: 'teal.700'}}
                            onClick={() => handleMove(category._id.toString(), 'up')}
                            disabled={isPending || isFirst}
                        >
                            <FiArrowUp/>
                        </IconButton>

                        <IconButton
                            aria-label="Move down"
                            color="teal.300"
                            variant="ghost"
                            size="sm"
                            _hover={{bg: 'teal.600', color: 'black', transform: 'translateY(1px)'}}
                            _active={{bg: 'teal.700'}}
                            onClick={() => handleMove(category._id.toString(), 'down')}
                            disabled={isPending || isLast}
                        >
                            <FiArrowDown/>
                        </IconButton>

                        <IconButton
                            aria-label="Delete category"
                            color="red.400"
                            variant="ghost"
                            size="sm"
                            _hover={{bg: 'red.600', color: 'black'}}
                            _active={{bg: 'red.700'}}
                            onClick={() => {
                                if (window.confirm('Вы точно хотите удалить категорию?')) {
                                    startTransition(async () => {
                                        await deleteCategory(category._id.toString())
                                    })
                                }
                            }}
                            disabled={isPending}
                        >
                            <FiTrash2/>
                        </IconButton>
                    </Table.Cell>
                </Table.Row>

                {childCategories.map((child) => renderRow(child, depth + 1))}
            </React.Fragment>
        )
    }

    const rootCategories = categories.filter((c) => !c.parent)

    return (
        <Box
            bg="black"
            p={6}
            rounded="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="teal.800"
        >
            <Text
                fontSize="xl"
                fontWeight="bold"
                color="teal.300"
                mb={4}
                borderBottom="1px solid"
                borderColor="teal.700"
                pb={2}
            >
                Изменение категорий
            </Text>

            <Table.Root
                size="md"
                variant="outline"
                borderColor="teal.800"
                bg="black"
                colorPalette="teal"
            >
                <Table.Header bg="teal.900">
                    <Table.Row>
                        <Table.ColumnHeader color="teal.200" fontWeight="bold">
                            Название
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color="teal.200" textAlign="center">
                            В меню
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color="teal.200" textAlign="center">
                            Показывать заголовок
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color="teal.200" textAlign="center">
                            Порядок
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>{rootCategories.map((cat) => renderRow(cat))}</Table.Body>
            </Table.Root>
        </Box>
    )
}
