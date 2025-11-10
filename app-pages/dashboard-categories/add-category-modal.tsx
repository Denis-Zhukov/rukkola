'use client'

import {
    Button,
    Box,
    Input,
    Text,
    HStack,
    createListCollection,
    CloseButton,
    Portal,
    Dialog,
    Checkbox,
    Select,
} from '@chakra-ui/react'
import {useState, useTransition} from 'react'
import {useSearchParams, useRouter, usePathname} from 'next/navigation'
import {createCategory} from './actions'
import {CategoryType} from '@/models/category'

type Props = { categories: CategoryType[] }

export default function AddCategoryDialog({categories}: Props) {
    const searchParams = useSearchParams()
    const isOpen = searchParams.has('addCategory');
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const [name, setName] = useState('')
    const [parent, setParent] = useState<string | undefined>(undefined)
    const [isMenuItem, setIsMenuItem] = useState(false)
    const [showGroupTitle, setShowGroupTitle] = useState(false)

    const onClose = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('addCategory')
        router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    }

    const onSubmit = () => {
        if (!name.trim()) return
        startTransition(async () => {
            await createCategory({
                name: name.trim(),
                parentId: parent || undefined,
                isMenuItem,
                showGroupTitle,
            })
            onClose();
        })
    }

    const buildCollectionItems = (cats: CategoryType[]) => {
        const items: Array<{ label: string; value: string }> = [];

        cats.filter(({parent}) => !parent)
            .forEach(({_id, name}) => {
                items.push({label: name, value: _id.toString()})
            })

        return items;
    }

    const collection = createListCollection({
        items: [{label: 'Нет родителя', value: ''}, ...buildCollectionItems(categories)],
    })

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
            <Dialog.Trigger asChild>
                <Box/>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop bg="blackAlpha.800"/>

                <Dialog.Positioner>
                    <Dialog.Content
                        bg="gray.900"
                        color="teal.200"
                        rounded="md"
                        p={6}
                        minW="400px"
                        boxShadow="lg"
                    >
                        <Dialog.CloseTrigger asChild>
                            <CloseButton position="absolute" top={2} right={2}/>
                        </Dialog.CloseTrigger>

                        <Dialog.Header>
                            <Text fontSize="xl" fontWeight="bold" mb={4}>
                                Добавить категорию
                            </Text>
                        </Dialog.Header>

                        <Dialog.Body display="flex" flexDirection="column" gap={4}>
                            {/* Название */}
                            <Box>
                                <Text mb={1}>Название</Text>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    bg="gray.800"
                                    color="teal.200"
                                    autoFocus
                                />
                            </Box>

                            <Box>
                                <Text mb={1}>Родитель</Text>
                                <Select.Root
                                    collection={collection}
                                    value={[parent!]}
                                    onValueChange={({value}) => setParent(value[0])}
                                >
                                    <Select.HiddenSelect/>
                                    <Select.Label>Выберите родителя</Select.Label>

                                    <Select.Control bg="gray.800" borderColor="teal.500">
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Нет родителя">
                                                {parent
                                                    ? categories.find((c) => c._id.toString() === parent)?.name
                                                    : 'Нет родителя'}
                                            </Select.ValueText>
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator/>
                                            <Select.ClearTrigger onClick={() => setParent(undefined)}/>
                                        </Select.IndicatorGroup>
                                    </Select.Control>

                                    <Select.Positioner>
                                        <Select.Content
                                            bg="gray.800"
                                            color="teal.200"
                                            borderWidth="1px"
                                            borderColor="teal.600"
                                            rounded="md"
                                            boxShadow="lg"
                                        >
                                            {collection.items.map((item) => (
                                                <Select.Item key={item.value} item={item}>
                                                    {item.label}
                                                    <Select.ItemIndicator/>
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </Box>

                            <HStack gap={6}>
                                <Checkbox.Root
                                    checked={isMenuItem}
                                    onCheckedChange={(val) => setIsMenuItem(!!val)}
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
                                    />
                                    <Checkbox.Label color="teal.200">В меню</Checkbox.Label>
                                </Checkbox.Root>

                                <Checkbox.Root
                                    checked={showGroupTitle}
                                    onCheckedChange={(val) => setShowGroupTitle(!!val)}
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
                                    />
                                    <Checkbox.Label color="teal.200">Показывать заголовок</Checkbox.Label>
                                </Checkbox.Root>
                            </HStack>
                        </Dialog.Body>

                        <Dialog.Footer mt={4} display="flex" justifyContent="flex-end" gap={3}>
                            <Button variant="ghost" onClick={onClose}>
                                Отмена
                            </Button>
                            <Button colorScheme="teal" onClick={onSubmit} loading={isPending}>
                                Создать
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
