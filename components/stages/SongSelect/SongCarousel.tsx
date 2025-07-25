
'use client'

import { useGameContext } from "@/shared/GameContext"
import { Stages } from "@/shared/types";
import SongDisplay from "./SongDisplay";

export default function SongCarousel() {
    
    const { songs, stage } = useGameContext();
    var votingEnabled = stage === Stages.Voting;

    return <div className="flex flex-row overflow-x-scroll gap-x-10">
        {songs.map((song, index) => (
            <SongDisplay
                key={index}
                song={song}
                votingEnabled={votingEnabled}
            />
        ))}
    </div>
}
