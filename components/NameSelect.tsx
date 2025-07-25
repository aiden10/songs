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

    const { isConnected } = useWebSocket(
        hasJoined ? roomID.toString() : "", 
        hasJoined ? tempName : ""
    );

    if (hasJoined && !isConnected) {
        return <div>Connecting...</div>;
    }

    if (!hasJoined) {
        return (
            <div className={`absolute inset-0 bg-slate-800 z-10 ${visible}`}>
                <div className="flex flex-col justify-center place-items-center min-h-screen space-y-10 text-white z-15">
                    <h1>Enter a name:</h1>
                    <input 
                        type="text" 
                        defaultValue={tempName}
                        onInput={(e) => setTempName(e.currentTarget.value)}
                        minLength={1}
                    />
                    <button
                        className="hover:cursor-pointer"
                        onClick={() => {
                            setName(tempName);
                            setHasJoined(true);
                            setVisible("collapse");
                        }}
                    >
                        Join
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
