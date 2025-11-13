'use client'

import React, { useState } from 'react'
import {
    Dialog,
    Button,
    Flex,
    Stack,
    Input,
    Text,
    Heading
} from '@chakra-ui/react'
import { Select, createListCollection } from '@chakra-ui/react'
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
                                    p={2}
                                    placeholder="Логин"
                                    bg="gray.700"
                                    color="white"
                                    autoFocus
                                    {...register('username', { required: 'Логин обязателен' })}
                                />
                                {errors.username && (
                                    <Text color="red.400" fontSize="sm">
                                        {errors.username.message}
                                    </Text>
                                )}

                                <Input
                                    p={2}
                                    placeholder="Пароль"
                                    type="password"
                                    bg="gray.700"
                                    color="white"
                                    {...register('password', { required: 'Пароль обязателен', minLength: { value: 6, message: 'Минимум 6 символов' } })}
                                />
                                {errors.password && (
                                    <Text color="red.400" fontSize="sm">
                                        {errors.password.message}
                                    </Text>
                                )}

                                <Input
                                    p={2}
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
                                    p={2}
                                    placeholder="Фамилия"
                                    bg="gray.700"
                                    color="white"
                                    {...register('surname')}
                                />

                                <Input
                                    p={2}
                                    placeholder="Отчество"
                                    bg="gray.700"
                                    color="white"
                                    {...register('patronymic')}
                                />

                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select.Root
                                                collection={roles}
                                                value={[field.value]}
                                                positioning={{ strategy: 'fixed', hideWhenDetached: true }}
                                                onValueChange={(item) => {
                                                    field.onChange(item.value[0])
                                                }}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Control>
                                                    <Select.Trigger
                                                        p={2}
                                                        bg="gray.800"
                                                        color="teal.200"
                                                        borderColor="teal.600"
                                                        height="40px"
                                                        _hover={{ borderColor: 'teal.500' }}
                                                    >
                                                        <Select.ValueText placeholder="Выберите роль" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>

                                                    <Select.Positioner>
                                                        <Select.Content bg="gray.800" borderColor="teal.600" border="1px solid">
                                                            {roles.items.map((item) => (
                                                                <Select.Item key={item.value} item={item}>
                                                                    {item.label}
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                            </Select.Root>

                                            {errors.role && (
                                                <Text color="red.400" fontSize="sm">
                                                    {errors.role.message}
                                                </Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Stack>

                            <Dialog.Footer mt={6} borderColor="gray.700">
                                <Button
                                    p={2}
                                    variant="outline"
                                    color="gray.400"
                                    size="sm"
                                    mr={2}
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    p={2}
                                    variant="outline"
                                    type="submit"
                                    color="teal.300"
                                    borderColor="teal.300"
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
