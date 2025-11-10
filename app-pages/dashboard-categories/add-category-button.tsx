'use client'

import { Button } from '@chakra-ui/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function AddCategoryButton() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const open = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('addCategory', 'true')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Button colorScheme="teal" onClick={open} size="sm">
            Добавить категорию
        </Button>
    )
}
