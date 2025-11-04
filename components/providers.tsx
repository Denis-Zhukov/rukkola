'use client'

import {ChakraProvider, defaultConfig, createSystem} from '@chakra-ui/react'
import {Suspense} from "react";

type ProvidersProps = { children: React.ReactNode }

const system = createSystem(defaultConfig);

export function Providers({children}: ProvidersProps) {
    return <ChakraProvider value={system}>
        <Suspense fallback="Загрузка...">
            {children}
        </Suspense>
    </ChakraProvider>
}