
'use client'

import { Song, Stages } from "@/shared/types";
import { useGameContext } from "@/shared/GameContext"
import { useState, useEffect } from "react";
import SongReveal from "./SongReveal";

export default function RevealStage() {
    const { songs, currentRound, roundsLimit, setStage, setSongs, setVotes, setCurrentRound } = useGameContext();
    const [songIndex, setSongIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [nextText, setNextText] = useState("Next");

    useEffect(() => {
        setSongIndex(0);
        setNextText("Next");
    }, [songs.length]);

    useEffect(() => {
        if (songs.length > 0 && songIndex >= 0 && songIndex < songs.length) {
            setCurrentSong(songs[songIndex]);
        } else {
            setCurrentSong(null);
        }
    }, [songIndex, songs]);


    useEffect(() => {
        if (songs.length > 0 && songIndex === songs.length - 1) {
            setNextText("Continue");
        } else {
            setNextText("Next");
        }
    }, [songIndex, songs.length]);


    if (songs.length === 0 || !currentSong) {
        return <div>Loading songs...</div>;
    }

    return (
        <div className="flex flex-row">
            <button
                className={`${songIndex <= 0 ? "hidden" : "visible"}`}
                onClick={() => {
                    setSongIndex(prev => Math.max(0, prev - 1));
                }}
            >
                Previous
            </button>
            
            <SongReveal song={currentSong} />
            
            <button
                onClick={() => {
                    if (nextText === "Continue") {

                        if (currentRound >= roundsLimit) {
                            setStage(Stages.Results);
                        } else {

                            setCurrentRound(prev => prev + 1);
                            setSongs([]);
                            setVotes([]);
                            setStage(Stages.SongSelect);
                        }
                        return;
                    }
                    

                    setSongIndex(prev => Math.min(songs.length - 1, prev + 1));
                }}
            >
                {nextText}
            </button>
        </div>
    );
}