
'use client'

import { useGameContext } from "@/shared/GameContext";
import { useState } from "react";
import Leaderboard from "./Leaderboard";

export default function ResultsStage() {
    const { host, submitRestart } = useGameContext();
    const [newRounds, setNewRounds] = useState(1);

    return <div className="flex flex-col gap-y-10">
        <Leaderboard/>
        <div className={`flex flex-row ${host? "visible" : "invisible"} md:gap-x-5 gap-x-2 items-center md:max-w-1/2`}>
            <button className="p-1 hover:cursor-pointer hover:opacity-75 bg-lime-300 border-4 rounded-md md:text-[24px]"
                onClick={() => submitRestart(newRounds)}
            >
                New Game
            </button>
            <p className="md:text-[24px] p-1">Rounds to play:</p>
            <input 
                type="number"
                className="bg-lime-300 p-3 text-white md:text-[24px] border-4 border-white"
                defaultValue={1}
                min="1" 
                onChange={(e) => setNewRounds(Number(e.target.value))}
            />
        </div>
    </div>
}