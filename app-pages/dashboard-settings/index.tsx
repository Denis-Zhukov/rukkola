'use client'

import React, {useTransition, useState} from 'react'
import {
    Box,
    Input,
    Button,
    Text,
    VStack,
    Alert,
    Separator,
    Flex,
    IconButton,
} from '@chakra-ui/react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {FiAlertTriangle, FiCheckCircle, FiLock, FiEye, FiEyeOff} from 'react-icons/fi'
import {updatePassword} from './actions'
import {useSession} from 'next-auth/react'
import {passwordSchema, type PasswordFormData} from './validation';


export const DashboardSettingsPage = () => {
    const {data} = useSession()
    const [isPending, startTransition] = useTransition()
    const [serverError, setServerError] = useState('')
    const [serverSuccess, setServerSuccess] = useState('')
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    })

    const onSubmit = (values: PasswordFormData) => {
        setServerError('')
        setServerSuccess('')

        startTransition(async () => {
            if (!data) return

            try {
                await updatePassword(data.user.id, values.oldPassword, values.newPassword)
                setServerSuccess('Пароль успешно изменён')
                reset()
            } catch (e: unknown) {
                setServerError((e as { message: string })?.message || 'Ошибка при изменении пароля')
            }
        })
    }

    const fieldErrorText = (fieldName: keyof PasswordFormData) =>
        errors[fieldName] ? String(errors[fieldName]?.message) : ''

    return (
        <Box>
            <Flex align="center" gap={3} mb={6}>
                <Box
                    bg="teal.700"
                    p={3}
                    rounded="full"
                    boxShadow="0 0 15px rgba(56,178,172,0.6)"
                >
                    <FiLock size={20} color="white"/>
                </Box>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, teal.300, teal.100)"
                >
                    Настройки безопасности
                </Text>
            </Flex>

            <Separator borderColor="teal.800" mb={6}/>

            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={5} align="stretch" maxW={600}>
                    <Box>
                        <Text mb={2} color="teal.200" fontWeight="medium">
                            Текущий пароль
                        </Text>
                        <Box position="relative">
                            <Input
                                p={2}
                                type={showOld ? 'text' : 'password'}
                                bg="gray.900"
                                color="teal.200"
                                borderColor={fieldErrorText('oldPassword') ? 'red.700' : 'teal.700'}
                                _focus={{
                                    borderColor: fieldErrorText('oldPassword') ? 'red.600' : 'teal.400',
                                    boxShadow: fieldErrorText('oldPassword')
                                        ? '0 0 8px rgba(255,90,90,0.14)'
                                        : '0 0 10px rgba(56,178,172,0.4)',
                                }}
                                _hover={{borderColor: 'teal.600'}}
                                rounded="lg"
                                size="md"
                                {...register('oldPassword')}
                            />
                            <IconButton
                                aria-label={showOld ? 'Hide password' : 'Show password'}
                                size="sm"
                                variant="ghost"
                                position="absolute"
                                right={2}
                                top="50%"
                                transform="translateY(-50%)"
                                onClick={() => setShowOld((s) => !s)}
                                color="teal.200"
                                _hover={{bg: 'blackAlpha.400'}}>
                                {showOld ? <FiEyeOff/> : <FiEye/>}
                            </IconButton>
                        </Box>
                        {fieldErrorText('oldPassword') ? (
                            <Text mt={2} color="red.300" fontSize="sm">
                                {fieldErrorText('oldPassword')}
                            </Text>
                        ) : null}
                    </Box>

                    <Box>
                        <Text mb={2} color="teal.200" fontWeight="medium">
                            Новый пароль
                        </Text>
                        <Box position="relative">
                            <Input
                                p={2}
                                type={showNew ? 'text' : 'password'}
                                bg="gray.900"
                                color="teal.200"
                                borderColor={fieldErrorText('newPassword') ? 'red.700' : 'teal.700'}
                                _focus={{
                                    borderColor: fieldErrorText('newPassword') ? 'red.600' : 'teal.400',
                                    boxShadow: fieldErrorText('newPassword')
                                        ? '0 0 8px rgba(255,90,90,0.14)'
                                        : '0 0 10px rgba(56,178,172,0.4)',
                                }}
                                _hover={{borderColor: 'teal.600'}}
                                rounded="lg"
                                size="md"
                                {...register('newPassword')}
                            />
                            <IconButton
                                aria-label={showNew ? 'Hide password' : 'Show password'}
                                size="sm"
                                variant="ghost"
                                position="absolute"
                                right={2}
                                top="50%"
                                transform="translateY(-50%)"
                                onClick={() => setShowNew((s) => !s)}
                                color="teal.200"
                                _hover={{bg: 'blackAlpha.400'}}>
                                {showNew ? <FiEyeOff/> : <FiEye/>}
                            </IconButton>
                        </Box>
                        {fieldErrorText('newPassword') ? (
                            <Text mt={2} color="red.300" fontSize="sm">
                                {fieldErrorText('newPassword')}
                            </Text>
                        ) : (
                            <Text mt={2} color="teal.300" fontSize="sm">
                                Минимум 6 символов
                            </Text>
                        )}
                    </Box>

                    <Box>
                        <Text mb={2} color="teal.200" fontWeight="medium">
                            Подтвердите новый пароль
                        </Text>
                        <Box position="relative">
                            <Input
                                p={2}
                                type={showConfirm ? 'text' : 'password'}
                                bg="gray.900"
                                color="teal.200"
                                borderColor={fieldErrorText('confirmPassword') ? 'red.700' : 'teal.700'}
                                _focus={{
                                    borderColor: fieldErrorText('confirmPassword') ? 'red.600' : 'teal.400',
                                    boxShadow: fieldErrorText('confirmPassword')
                                        ? '0 0 8px rgba(255,90,90,0.14)'
                                        : '0 0 10px rgba(56,178,172,0.4)',
                                }}
                                _hover={{borderColor: 'teal.600'}}
                                rounded="lg"
                                size="md"
                                {...register('confirmPassword')}
                            />
                            <IconButton
                                size="sm"
                                aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'}
                                variant="ghost"
                                position="absolute"
                                right={2}
                                top="50%"
                                transform="translateY(-50%)"
                                onClick={() => setShowConfirm((s) => !s)}
                                color="teal.200"
                                _hover={{bg: 'blackAlpha.400'}}>
                                {showConfirm ? <FiEyeOff/> : <FiEye/>}
                            </IconButton>
                        </Box>
                        {fieldErrorText('confirmPassword') ? (
                            <Text mt={2} color="red.300" fontSize="sm">
                                {fieldErrorText('confirmPassword')}
                            </Text>
                        ) : null}
                    </Box>

                    {serverError && (
                        <Alert.Root
                            p={4}
                            status="error"
                            bg="red.900"
                            color="red.200"
                            rounded="lg"
                            border="1px solid"
                            borderColor="red.700"
                        >
                            <Alert.Indicator>
                                <FiAlertTriangle/>
                            </Alert.Indicator>
                            <Alert.Content>
                                <Alert.Title fontWeight="bold">Ошибка</Alert.Title>
                                <Alert.Description>{serverError}</Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    {serverSuccess && (
                        <Alert.Root
                            p={4}
                            status="success"
                            bg="teal.900"
                            color="teal.100"
                            rounded="lg"
                            border="1px solid"
                            borderColor="teal.700"
                        >
                            <Alert.Indicator>
                                <FiCheckCircle/>
                            </Alert.Indicator>
                            <Alert.Content>
                                <Alert.Title fontWeight="bold">Успех</Alert.Title>
                                <Alert.Description>{serverSuccess}</Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    <Button
                        mt={2}
                        size="md"
                        type="submit"
                        loading={isPending}
                        loadingText="Сохранение..."
                        bg="teal.500"
                        color="whitesmoke"
                        _hover={{
                            bg: 'teal.400',
                            boxShadow: '0 0 20px rgba(56,178,172,0.4)',
                        }}
                        _active={{transform: 'scale(0.98)'}}
                        rounded="xl"
                        transition="all 0.2s ease"
                    >
                        Сохранить изменения
                    </Button>
                </VStack>
            </form>
        </Box>
    )
}
