
'use client'

import { Song } from "@/shared/types";
import PlayerSearch from "../Voting/PlayerSearch";

export default function SongDisplay({song, votingEnabled}: {song: Song, votingEnabled: boolean}) {
    return <div className="flex flex-col bg-lime-300 p-8 border-4 border-black
     justify-center place-items-center rounded-md gap-y-3">
        <img className="max-w-64 min-h-64 border-4 border-white" src={song.cover}/>
        <h1 className="text-white font-semibold bg-black/50 px-5 border-4 border-black rounded-xs">title: {song.name}</h1>
        <h1 className="text-white font-semibold bg-black/50 px-5 border-4 border-black rounded-xs">artist: {song.artist}</h1>
        <h1 className="text-white font-semibold bg-black/50 px-5 border-4 border-black rounded-xs">genres: {song.genres.join(', ')}</h1>
        <audio controls src={song.previewURL} className="rounded-md border-4 border-black"></audio>
        {
            votingEnabled && 
            <PlayerSearch
                songID={song.songID}
            />
        }
    </div>
}
