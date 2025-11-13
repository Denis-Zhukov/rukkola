'use client'

import React, {useState, useEffect} from 'react'
import {
    Box,
    Card,
    Flex,
    IconButton,
    Input,
    Table,
    Text,
    Spinner,
} from '@chakra-ui/react'
import {FiEdit, FiTrash2, FiCheck, FiX} from 'react-icons/fi'
import {getUsers, updateUser, deleteUser} from './actions'
import {UserType} from '@/models/user'
import {Tooltip} from '@/components/tooltip'

type TempUser = {
    username?: string
    name?: string
    surname?: string
    patronymic?: string
    role?: string
}

export const DashboardSettingsPage = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [tempUser, setTempUser] = useState<TempUser>({})

    useEffect(() => {
        ;(async () => {
            try {
                const data = await getUsers()
                setUsers(data as unknown as UserType[]);
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return
        try {
            await deleteUser(id) // server action
            setUsers((prev) => prev.filter((u) => u._id.toString() !== id))
        } catch (e) {
            console.error(e)
        }
    }

    const handleEditStart = (user: UserType) => {
        setEditingId(user._id.toString())
        setTempUser({
            username: user.username,
            name: user.name,
            surname: user.surname || '',
            patronymic: user.patronymic || '',
            role: user.role || 'admin',
        })
    }

    const handleEditCancel = () => {
        setEditingId(null)
        setTempUser({})
    }

    const handleEditSave = async (id: string) => {
        if (!tempUser.username || !tempUser.name) return
        try {
            await updateUser(id, tempUser as UserType);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id.toString() === id
                        ? {...u, ...tempUser, role: tempUser.role as 'admin'} as UserType
                        : u
                )
            )
            setEditingId(null)
            setTempUser({})
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Box minH="100vh" p={4}>
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
                    py={3}
                    textAlign="center"
                    color="white"
                >
                    <Text fontSize="lg" fontWeight="semibold">
                        Пользователи
                    </Text>
                </Card.Header>

                <Card.Body px={0} py={0}>
                    <Box overflowX="auto" position="relative">
                        {loading && (
                            <Flex
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                justify="center"
                                align="center"
                                bg="rgba(0,0,0,0.3)"
                                zIndex={10}
                                borderRadius="xl"
                            >
                                <Spinner size="xl" color="teal.400"/>
                            </Flex>
                        )}

                        <Table.Root size="md" variant="outline" w="100%">
                            <Table.Header bg="gray.800">
                                <Table.Row>
                                    {['Логин', 'Имя', 'Фамилия', 'Отчество', 'Роль', 'Действия'].map(
                                        (col) => (
                                            <Table.ColumnHeader
                                                key={col}
                                                textAlign={col === 'Логин' ? 'left' : 'center'}
                                                color="white"
                                                p={4}
                                                fontWeight="semibold"
                                            >
                                                {col}
                                            </Table.ColumnHeader>
                                        )
                                    )}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {users.length > 0 ? (
                                    users.map((user) => {
                                        const isEditing = editingId === user._id.toString()
                                        return (
                                            <Table.Row
                                                key={user._id.toString()}
                                                bg="gray.900"
                                                borderBottom="1px solid"
                                                borderColor="gray.700"
                                                _hover={{bg: 'gray.800', transition: '0.2s ease'}}
                                            >
                                                <Table.Cell p={4}>
                                                    {isEditing ? (
                                                        <Input
                                                            size="sm"
                                                            value={tempUser.username}
                                                            onChange={(e) =>
                                                                setTempUser((prev) => ({
                                                                    ...prev,
                                                                    username: e.target.value,
                                                                }))
                                                            }
                                                            bg="gray.700"
                                                            color="white"
                                                        />
                                                    ) : (
                                                        <Text color="white">{user.username}</Text>
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell p={4} textAlign="center">
                                                    {isEditing ? (
                                                        <Input
                                                            size="sm"
                                                            value={tempUser.name}
                                                            onChange={(e) =>
                                                                setTempUser((prev) => ({
                                                                    ...prev,
                                                                    name: e.target.value,
                                                                }))
                                                            }
                                                            bg="gray.700"
                                                            color="white"
                                                        />
                                                    ) : (
                                                        <Text color="white">{user.name}</Text>
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell p={4} textAlign="center">
                                                    {isEditing ? (
                                                        <Input
                                                            size="sm"
                                                            value={tempUser.surname}
                                                            onChange={(e) =>
                                                                setTempUser((prev) => ({
                                                                    ...prev,
                                                                    surname: e.target.value,
                                                                }))
                                                            }
                                                            bg="gray.700"
                                                            color="white"
                                                        />
                                                    ) : (
                                                        <Text color="white">{user.surname || '-'}</Text>
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell p={4} textAlign="center">
                                                    {isEditing ? (
                                                        <Input
                                                            size="sm"
                                                            value={tempUser.patronymic}
                                                            onChange={(e) =>
                                                                setTempUser((prev) => ({
                                                                    ...prev,
                                                                    patronymic: e.target.value,
                                                                }))
                                                            }
                                                            bg="gray.700"
                                                            color="white"
                                                        />
                                                    ) : (
                                                        <Text color="white">{user.patronymic || '-'}</Text>
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell p={4} textAlign="center">
                                                    {isEditing ? (
                                                        <Input
                                                            size="sm"
                                                            value={tempUser.role}
                                                            onChange={(e) =>
                                                                setTempUser((prev) => ({
                                                                    ...prev,
                                                                    role: e.target.value,
                                                                }))
                                                            }
                                                            bg="gray.700"
                                                            color="white"
                                                        />
                                                    ) : (
                                                        <Text color="white">{user.role || '-'}</Text>
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell p={4}>
                                                    <Flex justify="center" gap={2}>
                                                        {isEditing ? (
                                                            <>
                                                                <Tooltip content="Сохранить">
                                                                    <IconButton
                                                                        aria-label="Сохранить"
                                                                        size="sm"
                                                                        borderRadius="xl"
                                                                        bgGradient="linear(to-r, green.400, green.500)"
                                                                        color="white"
                                                                        _hover={{
                                                                            transform: 'scale(1.1)',
                                                                            bgGradient:
                                                                                'linear(to-r, green.500, green.600)',
                                                                        }}
                                                                        onClick={() =>
                                                                            handleEditSave(user._id.toString())
                                                                        }
                                                                    >
                                                                        <FiCheck/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip content="Отмена">
                                                                    <IconButton
                                                                        aria-label="Отмена"
                                                                        size="sm"
                                                                        borderRadius="xl"
                                                                        bgGradient="linear(to-r, gray.500, gray.600)"
                                                                        color="white"
                                                                        _hover={{
                                                                            transform: 'scale(1.1)',
                                                                            bgGradient:
                                                                                'linear(to-r, gray.600, gray.700)',
                                                                        }}
                                                                        onClick={handleEditCancel}
                                                                    >
                                                                        <FiX/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Tooltip content="Редактировать">
                                                                    <IconButton
                                                                        aria-label="Редактировать"
                                                                        size="sm"
                                                                        borderRadius="xl"
                                                                        bgGradient="linear(to-r, blue.400, blue.500)"
                                                                        color="white"
                                                                        _hover={{
                                                                            transform: 'scale(1.1)',
                                                                            bgGradient:
                                                                                'linear(to-r, blue.500, blue.600)',
                                                                        }}
                                                                        onClick={() => handleEditStart(user)}
                                                                    >
                                                                        <FiEdit/>
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip content="Удалить">
                                                                    <IconButton
                                                                        aria-label="Удалить"
                                                                        size="sm"
                                                                        borderRadius="xl"
                                                                        bgGradient="linear(to-r, red.500, red.600)"
                                                                        color="white"
                                                                        _hover={{
                                                                            transform: 'scale(1.1)',
                                                                            bgGradient:
                                                                                'linear(to-r, red.600, red.700)',
                                                                        }}
                                                                        onClick={() => handleDelete(user._id.toString())}
                                                                    >
                                                                        <FiTrash2/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </Flex>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} textAlign="center" color="gray.500" py={8}>
                                            Нет пользователей
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card.Body>
            </Card.Root>
        </Box>
    )
}
