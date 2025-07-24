
'use client'

import { Song } from "@/shared/types";
import PlayerSearch from "../Voting/PlayerSearch";

export default function SongDisplay({song, votingEnabled}: {song: Song, votingEnabled: boolean}) {
    return <div className="flex flex-col ">
        <img className="max-w-64 min-h-64" src={song.cover}/>
        <h1>{song.name}</h1>
        <h1>{song.artist}</h1>
        <h1>{song.genres.join(', ')}</h1>
        <audio controls src={song.previewURL}></audio>
        {
            votingEnabled && 
            <PlayerSearch
                songID={song.songID}
            />
        }
    </div>
}
