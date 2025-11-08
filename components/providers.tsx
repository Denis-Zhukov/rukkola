'use client'

import {ChakraProvider, defaultConfig, createSystem} from '@chakra-ui/react'
import {Suspense} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

type ProvidersProps = { children: React.ReactNode }

const system = createSystem(defaultConfig);

export function Providers({children}: ProvidersProps) {
    const queryClient = new QueryClient()
    return <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
            <Suspense fallback="Загрузка...">
                {children}
            </Suspense>
        </ChakraProvider>
    </QueryClientProvider>
}