'use client'

import {Button} from '@chakra-ui/react'
import {useRouter, useSearchParams} from 'next/navigation'
import {PlusIcon} from 'lucide-react'

export const CreateProductButton = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleOpen = () => {
        const params = new URLSearchParams(searchParams)
        params.set('create', 'true')
        router.push(`?${params.toString()}`, {scroll: false})
    }

    return (
        <Button
            p={2}
            mb={4}
            onClick={handleOpen}
            colorScheme="teal"
            size="sm"
            bg="teal.500"
            _hover={{bg: 'teal.400', boxShadow: '0 0 10px rgba(56,178,172,0.5)'}}
            _active={{bg: 'teal.600'}}
        >
            <PlusIcon size={16}/> Добавить продукт
        </Button>
    )
}
