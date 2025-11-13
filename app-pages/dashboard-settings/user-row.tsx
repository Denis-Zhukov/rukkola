'use client'

import React, {useState} from 'react'
import {Flex, Table, Text, Input, IconButton, Portal} from '@chakra-ui/react'
import {FiEdit, FiTrash2, FiCheck, FiX} from 'react-icons/fi'
import {UserType} from '@/models/user'
import {updateUser, deleteUser} from './actions'
import {Tooltip} from '@/components/tooltip'
import {Select, createListCollection} from '@chakra-ui/react'

type UserRowProps = {
    onUserDelete: (id: string) => void
    onUserUpdate: (user: UserType) => void
    user: UserType
}

const roles = createListCollection({
    items: [
        {label: 'admin', value: 'admin'},
        {label: 'moderator', value: 'moderator'},
    ],
})

export const UserRow = ({user, onUserUpdate, onUserDelete}: UserRowProps) => {
    const [editing, setEditing] = useState(false)
    const [tempUser, setTempUser] = useState<UserType>(user)
    const isEditing = editing

    const handleSave = async () => {
        try {
            await updateUser(user._id.toString(), tempUser)
            onUserUpdate({...user, ...tempUser} as UserType)
            setEditing(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleCancel = () => {
        setEditing(false)
        setTempUser(user)
    }

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return
        try {
            await deleteUser(user._id.toString())
            onUserDelete(user._id.toString())
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Table.Row bg="gray.900" borderBottom="1px solid" borderColor="gray.700">
            <Table.Cell p={4}>
                {isEditing ? (
                    <Input
                        size="sm"
                        value={tempUser.username ?? ''}
                        onChange={(e) => setTempUser({...tempUser, username: e.target.value} as UserType)}
                        bg="gray.700"
                        color="white"
                    />
                ) : (
                    <Text color="white">{user.username}</Text>
                )}
            </Table.Cell>

            <Table.Cell p={4}>
                {isEditing ? (
                    <Input
                        size="sm"
                        value={tempUser.name ?? ''}
                        onChange={(e) => setTempUser({...tempUser, name: e.target.value} as UserType)}
                        bg="gray.700"
                        color="white"
                    />
                ) : (
                    <Text color="white">{user.name}</Text>
                )}
            </Table.Cell>

            <Table.Cell p={4}>
                {isEditing ? (
                    <Input
                        size="sm"
                        value={tempUser.surname ?? ''}
                        onChange={(e) => setTempUser({...tempUser, surname: e.target.value}as UserType)}
                        bg="gray.700"
                        color="white"
                    />
                ) : (
                    <Text color="white">{user.surname || '-'}</Text>
                )}
            </Table.Cell>

            <Table.Cell p={4}>
                {isEditing ? (
                    <Input
                        size="sm"
                        value={tempUser.patronymic ?? ''}
                        onChange={(e) => setTempUser({...tempUser, patronymic: e.target.value}as UserType)}
                        bg="gray.700"
                        color="white"
                    />
                ) : (
                    <Text color="white">{user.patronymic || '-'}</Text>
                )}
            </Table.Cell>

            <Table.Cell p={4}>
                {isEditing ? (
                    <Select.Root
                        collection={roles}
                        value={[tempUser.role ?? 'moderator']}
                        onValueChange={(val) => setTempUser({...tempUser, role: val.value as unknown as "admin" | "moderator"} as UserType)}
                    >
                        <Select.HiddenSelect/>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Выберите роль"/>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator/>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {roles.items.map((item) => (
                                        <Select.Item key={item.value} item={item}>
                                            {item.label}
                                            <Select.ItemIndicator/>
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                ) : (
                    <Text color="white">{user.role || '-'}</Text>
                )}
            </Table.Cell>

            <Table.Cell p={4}>
                <Flex justify="center" gap={2}>
                    {isEditing ? (
                        <>
                            <Tooltip content="Сохранить">
                                <IconButton aria-label="Сохранить" size="sm"
                                            onClick={handleSave}><FiCheck/></IconButton>
                            </Tooltip>
                            <Tooltip content="Отмена">
                                <IconButton aria-label="Отмена" size="sm" onClick={handleCancel}><FiX/></IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip content="Редактировать">
                                <IconButton aria-label="Редактировать" size="sm"
                                            onClick={() => setEditing(true)}><FiEdit/></IconButton>
                            </Tooltip>
                            <Tooltip content="Удалить">
                                <IconButton aria-label="Удалить" size="sm"
                                            onClick={handleDelete}><FiTrash2/></IconButton>
                            </Tooltip>
                        </>
                    )}
                </Flex>
            </Table.Cell>
        </Table.Row>
    )
}
