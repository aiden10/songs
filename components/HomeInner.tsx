'use client'
import { useGameContext } from '@/shared/GameContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/shared/utils';

export default function HomeInner() {
    const { roomID, setRoomID } = useGameContext();
    const [rounds, setRounds] = useState(3);
    const router = useRouter();
    
    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen bg-amber-100 gap-8'>
            <h1 className='text-6xl md:text-7xl text-lime-400 mb-8 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)] font-semibold'>songuesser</h1>
            
            {/* Create Room Section */}
            <div className='flex flex-col items-center gap-4 w-full max-w-2xl px-4'>
                <div className='flex flex-col items-center w-full'>
                    <p className='text-lime-400 text-[24px] md:text-[28px] mb-2 drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.7)]
                    font-semibold'>rounds to play</p>
                    <input
                        type="number"
                        className='bg-lime-300 p-3 hover:opacity-85 text-white
                        text-lg md:text-xl w-full text-center text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)]
                        border-4 rounded-md focus:outline-none focus:border-white border-black'
                        onChange={(e) => setRounds(Number(e.currentTarget.value))}
                        placeholder='Rounds to play'
                        step={1}
                        min={1}
                        defaultValue={rounds}
                    />
                </div>
                <button 
                    className='bg-lime-300 hover:opacity-75 rounded-md text-white text-lg md:text-xl border-4 border-black
                     px-6 py-3 w-full transition-opacity hover:cursor-pointer text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)]'
                    onClick={async () => {
                        const id = (await createRoom(rounds)).room_id;
                        setRoomID(Number(id));
                        console.log(`ROOM ID: ${id}`);
                        router.push(`/game/${id}`)
                    }}
                >
                    create room
                </button>
            </div>
            
            {/* Join Room Section */}
            <div className='flex flex-col items-center gap-4 w-full max-w-2xl px-4'>
                <div className='flex flex-col items-center w-full'>
                    <p className='text-lime-400 text-[24px] md:text-[28px] mb-2 drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.7)]
                    font-semibold'>room id</p>
                    <input
                        type="number"
                        className='bg-lime-300 p-3 hover:opacity-85
                        text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)] text-white text-lg md:text-xl w-full text-center
                        border-4 rounded-md focus:outline-none focus:border-white border-black'
                        defaultValue={-1}
                        placeholder='Room ID'
                        onInput={(e) => setRoomID(Number(e.currentTarget.value))}
                    />
                </div>
                <button
                    className='bg-lime-300 hover:opacity-75 rounded-md text-white text-lg md:text-xl text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)]
                     px-6 py-3 w-full transition-opacity disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:cursor-pointer
                     border-4 border-black'
                    disabled={roomID === -1}
                    onClick={() => router.push(`/game/${roomID}`)}
                >
                    join room
                </button>
            </div>
        </div>
    );
}