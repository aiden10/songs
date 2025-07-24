
import { useGameContext } from "@/shared/GameContext"
import { Stages } from "@/shared/types";
import { useParams } from 'next/navigation';
import SongSelectStage from "./stages/SongSelect/SongSelectStage";
import VotingStage from "./stages/Voting/VotingStage";
import RevealStage from "./stages/Reveal/RevealStage";
import ResultsStage from "./stages/Results/ResultsStage";
import PlayerList from "./PlayerList";
import { useWebSocket } from "@/shared/hooks";
import { useEffect } from "react";

export default function GameScreen() {
    const params = useParams();
    const paramID = params?.id;
    const { roomID, name, stage, setRoomID } = useGameContext();
    useEffect(() => {
        if (!paramID) return;

        const idFromURL = Number(paramID);
        if (!isNaN(idFromURL)) {
            setRoomID(idFromURL);
        }
    }, [paramID, setRoomID]);

    const { isConnected } = useWebSocket(roomID.toString(), name);

    if (!isConnected) {
        return <div>Connecting...</div>;
    }
    
    return <div>
        <PlayerList/>
        { stage === Stages.SongSelect && <SongSelectStage/> }
        { stage === Stages.Voting && <VotingStage/> }
        { stage === Stages.Reveal && <RevealStage/> }
        { stage === Stages.Results && <ResultsStage/> }
    </div>
}