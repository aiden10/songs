
'use client'

import { useGameContext } from "@/shared/GameContext"
import { Stages } from "@/shared/types";
import SongDisplay from "./SongDisplay";

export default function SongCarousel() {
    
    const { songs, stage } = useGameContext();
    var votingEnabled = stage === Stages.Voting;

    return (
        <div className="flex flex-row overflow-x-auto gap-3 sm:gap-6 lg:gap-10 px-2
                       scrollbar-thin scrollbar-thumb-lime-300 scrollbar-track-amber-100">
            {songs.map((song, index) => (
                <SongDisplay
                    key={index}
                    song={song}
                    votingEnabled={votingEnabled}
                />
            ))}
        </div>
    )
}