import { useParams } from 'next/navigation';
import { useGameContext } from "@/shared/GameContext";
import { useState, useEffect } from "react";
import { useWebSocket } from '@/shared/hooks';

export default function NameSelect() {
    const params = useParams();
    const paramID = params?.id;
    const { name, setName, roomID, setRoomID } = useGameContext();
    
    const [tempName, setTempName] = useState(name);
    const [hasJoined, setHasJoined] = useState(false);
    const [visible, setVisible] = useState("visible");

    useEffect(() => {
        if (!paramID) return;

        const idFromURL = Number(paramID);
        if (!isNaN(idFromURL)) {
            setRoomID(idFromURL);
        }
    }, [paramID, setRoomID]);

    useEffect(() => {
        if (!name) return;
        setTempName(prev => (prev === "" ? name : prev));
    }, [name]);
    
    const { isConnected } = useWebSocket(
        hasJoined ? roomID.toString() : "", 
        hasJoined ? tempName : ""
    );

    if (hasJoined && !isConnected) {
        return <div>Connecting...</div>;
    }

    if (!hasJoined) {
        return (
            <div className={`absolute inset-0 bg-amber-100 z-10 ${visible}`}>
                <div className="flex flex-col justify-center place-items-center min-h-screen space-y-10 text-white z-15">
                    <h1 className='text-[48px] text-lime-300 drop-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)]'>enter a name</h1>
                    <input 
                        type="text"
                        className='bg-lime-300 p-2 hover:opacity-85 text-white text-[24px]
                         place-self-center text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)] 
                         border-4 rounded-md focus:outline-none focus:border-white border-black'
                        value={tempName}
                        onChange={(e) => setTempName(e.currentTarget.value)}
                    />
                    <button
                        className="btn m-5 px-25 py-3 min-w-75 hover:cursor-pointer text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)]
             hover:opacity-75 bg-lime-300 rounded-md text-white md:text-[24px] text-[20px] border-4 border-black"
                        disabled={!tempName.trim()}
                        onClick={() => {
                            setName(tempName);
                            setHasJoined(true);
                            setVisible("collapse");
                        }}
                    >
                        join
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
