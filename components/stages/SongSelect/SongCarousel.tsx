
'use client'

import { useGameContext } from "@/shared/GameContext"
import { Stages } from "@/shared/types";
import SongDisplay from "./SongDisplay";

export default function SongCarousel() {
    
    const { songs, stage } = useGameContext();
    const votingEnabled = stage === Stages.Voting;

    return (
        <div className="flex flex-row overflow-x-scroll max-w-full gap-x-2 items-stretch">
            {songs.map((song, index) => (
                <div key={index} className="flex-shrink-0">
                    <SongDisplay
                        song={song}
                        votingEnabled={votingEnabled}
                    />
                </div>
            ))}
        </div>
    )
}