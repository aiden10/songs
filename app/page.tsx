
'use client'

import { GameProvider } from '@/shared/GameContext';
import HomeInner from '@/components/HomeInner';

export default function Home() {

    return <GameProvider>
        <HomeInner/>
    </GameProvider>
}