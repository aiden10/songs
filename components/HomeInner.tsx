
'use client'

import { useGameContext } from '@/shared/GameContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/shared/utils';

export default function HomeInner() {
    const { name, roomID, setRoomID, setName } = useGameContext();
    const [rounds, setRounds] = useState(3);
    const router = useRouter();

    return <div className='flex flex-col place-items-center w-screen h-screen'>
        <h1 
            className='text-white text-[84px] mt-30 pb-20 animate-bounce'
            style={{animationDuration: '10s'}}>my song</h1>
        <input
            type="text"
            className='input'
            onChange={(e) => setName(e.currentTarget.value)}
            defaultValue={name}
            maxLength={35}
        />
        <h1 className='text-[64px] absolute left-0 top-0 m-5'>name: {name}</h1>
        <div className='flex-row flex place-items-center'>
            <input 
                type="number" 
                className='input'
                onChange={(e) => {setRounds(Number(e.currentTarget.value))}}
                placeholder='Rounds to play'
                step={2}
                min={3}
                defaultValue={rounds}
            />
            <button className='btn m-5 px-25 py-5 min-w-75'
                onClick={async () => {
                    let id = (await createRoom(rounds)).room_id;
                    setRoomID(Number(id));
                    console.log(`ROOM ID: ${id}`);
                    router.push(`/game/${id}`)
                }}>
                Create Room
            </button>
        </div>
        <div className='flex-row flex place-items-center'>
            <input 
                type="number" 
                className='input'
                defaultValue={-1}
                placeholder='roomID'
                onInput={(e) => {setRoomID(Number(e.currentTarget.value))}}
            />
            <button 
                className='btn m-5 px-25 py-5 min-w-75'
                disabled={roomID === -1}
                onClick={() => {router.push(`/game/${roomID}`);}}>
                Join Room
            </button>
        </div>
    </div>
}