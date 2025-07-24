
'use client'

import { Song, Stages } from "@/shared/types";
import { useGameContext } from "@/shared/GameContext"
import { useState, useEffect } from "react";
import SongReveal from "./SongReveal";

export default function RevealStage() {
    const { songs, currentRound, roundsLimit, setStage, setSongs, setVotes, setCurrentRound } = useGameContext();
    const [songIndex, setSongIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song>(songs[songIndex]);
    const [nextText, setNextText] = useState("Next");

    function updateCurrentSong() {
        setCurrentSong(songs[songIndex]);
    }
    
    useEffect(updateCurrentSong, [songIndex]);

    return <div className="flex flex-row">
        <button
            className={`${songIndex <= 0? "hidden" : "visible"}`}
            onClick={() => {
                setSongIndex(songIndex => songIndex - 1);
                if (songIndex !== songs.length - 1)
                    setNextText("Next");
            }}
        >
            Previous
        </button>
        <SongReveal
            song={currentSong}
        />
        <button
            onClick={() => {
                    if (songIndex === songs.length - 1) {
                        setNextText("Continue");
                    }
                    if (nextText === "Continue") {
                        if (currentRound >= roundsLimit){
                            setStage(Stages.Results);
                        }
                        else {
                            setCurrentRound(currentRound => currentRound + 1);
                            setSongs([]);
                            setVotes([]);
                            setStage(Stages.SongSelect);
                        }
                            
                        return;
                    }
                    setSongIndex(songIndex => songIndex + 1);
            }}
        >
            {nextText}
        </button>
    </div>
}