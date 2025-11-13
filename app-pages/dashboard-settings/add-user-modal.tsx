'use client'

import React, { useState } from 'react'
import {
    Dialog,
    Button,
    Flex,
    Stack,
    Input,
    Text,
    Heading,
    Select, createListCollection, Portal
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { UserType } from '@/models/user'
import { createUser } from './actions'

const roles = createListCollection({
    items: [
        { label: 'admin', value: 'admin' },
        { label: 'moderator', value: 'moderator' },
    ],
})

type FormValues = {
    username: string
    password: string
    name: string
    surname?: string
    patronymic?: string
    role: string
}

type AddUserModalProps = {
    isOpen: boolean
    onClose: () => void
    onUserAdded: (user: UserType) => void
}

export const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            username: '',
            password: '',
            name: '',
            surname: '',
            patronymic: '',
            role: 'moderator',
        },
    })

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        setError(null)

        try {
            const newUser = await createUser(data)
            onUserAdded(newUser)
            onClose()
            reset()
        } catch (e: any) {
            setError(e?.message || 'Ошибка при создании пользователя')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Backdrop bg="blackAlpha.800" backdropFilter="blur(6px)" />
            <Dialog.Positioner>
                <Dialog.Content
                    bg="gray.900"
                    borderRadius="xl"
                    shadow="xl"
                    border="1px solid"
                    borderColor="teal.600"
                    color="white"
                    maxW="md"
                    w="full"
                    p={6}
                >
                    <Dialog.Header borderBottom="1px solid" borderColor="gray.700" mb={4}>
                        <Flex justify="space-between" align="center">
                            <Heading size="md" color="teal.200">
                                Добавить пользователя
                            </Heading>
                            <Dialog.CloseTrigger asChild>
                                <Button size="sm" variant="ghost" color="gray.400">
                                    X
                                </Button>
                            </Dialog.CloseTrigger>
                        </Flex>
                    </Dialog.Header>

                    <Dialog.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap={4}>
                                {error && (
                                    <Text color="red.400" fontSize="sm">
                                        {error}
                                    </Text>
                                )}

                                <Input
                                    placeholder="Логин"
                                    bg="gray.700"
                                    color="white"
                                    {...register('username', { required: 'Логин обязателен' })}
                                />
                                {errors.username && (
                                    <Text color="red.400" fontSize="sm">
                                        {errors.username.message}
                                    </Text>
                                )}

                                <Input
                                    placeholder="Пароль"
                                    type="password"
                                    bg="gray.700"
                                    color="white"
                                    {...register('password', { required: 'Пароль обязателен' })}
                                />
                                {errors.password && (
                                    <Text color="red.400" fontSize="sm">
                                        {errors.password.message}
                                    </Text>
                                )}

                                <Input
                                    placeholder="Имя"
                                    bg="gray.700"
                                    color="white"
                                    {...register('name', { required: 'Имя обязательно' })}
                                />
                                {errors.name && (
                                    <Text color="red.400" fontSize="sm">
                                        {errors.name.message}
                                    </Text>
                                )}

                                <Input
                                    placeholder="Фамилия"
                                    bg="gray.700"
                                    color="white"
                                    {...register('surname')}
                                />

                                <Input
                                    placeholder="Отчество"
                                    bg="gray.700"
                                    color="white"
                                    {...register('patronymic')}
                                />

                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select.Root
                                            collection={roles}
                                            {...field}
                                            positioning={{ strategy: 'fixed', hideWhenDetached: true }}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger>
                                                    <Select.ValueText placeholder="Выберите роль" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {roles.items.map((item) => (
                                                            <Select.Item key={item.value} item={item}>
                                                                {item.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    )}
                                />
                            </Stack>

                            <Dialog.Footer mt={6} borderTop="1px solid" borderColor="gray.700">
                                <Button
                                    variant="outline"
                                    colorScheme="gray"
                                    size="sm"
                                    mr={2}
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    size="sm"
                                    loading={loading}
                                >
                                    Добавить
                                </Button>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
