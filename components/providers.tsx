'use client'

import {ChakraProvider, defaultConfig, createSystem} from '@chakra-ui/react'
import {Suspense} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SessionProvider} from "next-auth/react";

type ProvidersProps = { children: React.ReactNode }

const system = createSystem(defaultConfig);

export function Providers({children}: ProvidersProps) {
    const queryClient = new QueryClient()
    return <SessionProvider>
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={system}>
                <Suspense fallback="Загрузка...">
                    {children}
                </Suspense>
            </ChakraProvider>
        </QueryClientProvider>
    </SessionProvider>
}