'use client'

import React, { useState, useEffect } from 'react'
import { Box, Flex, Spinner, Text, Button, Card, Table } from '@chakra-ui/react'
import { getUsers } from './actions'
import { UserType } from '@/models/user'
import { AddUserModal } from './add-user-modal'
import { UserRow } from './user-row'

export const UsersTable = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const data = await getUsers()
                setUsers(data)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const handleUserCreated = (newUser: UserType) => {
        setUsers((prev) => [newUser, ...prev])
    }

    return (
        <>
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
                    px={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    color="white"
                >
                    <Text fontSize="lg" fontWeight="semibold">
                        Пользователи
                    </Text>

                    <Button colorScheme="teal" size="sm" onClick={() => setIsAddOpen(true)}>
                        Добавить
                    </Button>
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
                                <Spinner size="xl" color="teal.400" />
                            </Flex>
                        )}

                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    {['Логин', 'Имя', 'Фамилия', 'Отчество', 'Роль', 'Действия'].map(
                                        (col) => (
                                            <Table.ColumnHeader key={col} px={4} py={3}>
                                                {col}
                                            </Table.ColumnHeader>
                                        )
                                    )}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {!loading && users.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} textAlign="center" py={8} color="gray.400">
                                            Нет пользователей
                                        </Table.Cell>
                                    </Table.Row>
                                )}

                                {users.map((user) => (
                                    <UserRow
                                        key={user._id.toString()}
                                        user={user}
                                        onUserUpdate={(updated) =>
                                            setUsers((prev) =>
                                                prev.map((u) => (u._id === updated._id ? updated : u))
                                            )
                                        }
                                        onUserDelete={(id) =>
                                            setUsers((prev) => prev.filter((u) => u._id.toString() !== id))
                                        }
                                    />
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card.Body>
            </Card.Root>

            <AddUserModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onUserAdded={handleUserCreated}
            />
        </>
    )
}
