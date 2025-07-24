
'use client'

import { useGameContext } from "@/shared/GameContext";
import { useState } from "react";
import Leaderboard from "./Leaderboard";

export default function ResultsStage() {
    const {host, submitRestart, players} = useGameContext();
    const [newRounds, setNewRounds] = useState(1);

    return <div className="flex flex-col">
        <Leaderboard/>
        <div className={`flex flex-row ${host? "visible" : "invisible"}`}>
            <button
                onClick={() => submitRestart(newRounds)}
            >
                New Game
            </button>
            <p>Rounds to play:</p>
            <input 
                type="number"
                defaultValue={1}
                min="1" 
                onChange={(e) => setNewRounds(Number(e.target.value))}
            />
        </div>
    </div>
}