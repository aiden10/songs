
'use client'

import { Song } from "@/shared/types";
import PlayerSearch from "../Voting/PlayerSearch";
import Image from "next/image";

export default function SongDisplay({song, votingEnabled}: {song: Song, votingEnabled: boolean}) {
    return (
        <div className="flex flex-col bg-lime-300 p-4 border-4 border-black
                        justify-start items-center rounded-md gap-y-2 h-full
                        max-h-[32rem] md:w-full w-[12rem] overflow-y-auto">
            
            <Image
                src={song.cover}
                alt={`${song.name}-cover`}
                width={192}
                height={192}
                className="w-48 h-48 object-cover border-4 border-white"
            />
            <h1 className="text-white font-semibold bg-black/50 px-3 border-2 border-black rounded-xs text-center">title: {song.name}</h1>
            <h1 className="text-white font-semibold bg-black/50 px-3 border-2 border-black rounded-xs text-center">artist: {song.artist}</h1>
            <h1 className="text-white font-semibold bg-black/50 px-3 border-2 border-black rounded-xs text-center">genres: {song.genres.join(', ')}</h1>
            <audio controls src={song.previewURL} className="rounded-md border-2 border-black w-full"></audio>
            {
                votingEnabled &&
                <PlayerSearch songID={song.songID} />
            }
        </div>
    );
}