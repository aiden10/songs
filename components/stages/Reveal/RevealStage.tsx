
'use client'

import { Song } from "@/shared/types";
import { useGameContext } from "@/shared/GameContext"
import { useState, useEffect } from "react";
import SongReveal from "./SongReveal";

export default function RevealStage() {
    const { songs, setSongs, setVotes, setCurrentRound, submitDoneReveal } = useGameContext();
    const [songIndex, setSongIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [nextText, setNextText] = useState("Next");
    const [waiting, setWaiting] = useState(false);

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


    if (waiting) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-amber-100">
            <h1 className="md:text-[42px] text-[36px] animate-pulse text-center">Waiting for other players...</h1>
            </div>
        );
    }
    if (songs.length === 0 || !currentSong) {
        return <div>Loading songs...</div>;
    }

    return (
        <div className="flex flex-col sm:flex-row gap-y-6 sm:gap-x-10 items-center justify-center p-4 w-full">
            <button
                className={`${songIndex <= 0 ? "hidden" : "visible"} bg-lime-300 
                text-[24px] border-4 px-3 hover:cursor-pointer hover:opacity-75`}
                onClick={() => {
                    setSongIndex(prev => Math.max(0, prev - 1));
                }}
            >
                Previous
            </button>
            
            <SongReveal song={currentSong} />
            
            <button
                className="bg-lime-300 border-4 px-3 hover:cursor-pointer hover:opacity-75 text-[24px]"
                onClick={() => {
                    if (nextText === "Continue") {
                        setCurrentRound(prev => prev + 1);
                        setSongs([]);
                        setVotes([]);
                        submitDoneReveal();
                        setWaiting(true);
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