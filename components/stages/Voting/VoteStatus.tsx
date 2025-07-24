
'use client'

import React from 'react';
import { useGameContext } from '@/shared/GameContext';
import { Vote } from '@/shared/types';

function VoteItem({ vote }: { vote: Vote }) {
    const { songs, getPlayerData } = useGameContext();
    
    const song = songs.find(s => s.songID === vote.songID);
    const player = getPlayerData(vote.voteRecipientID);
    
    if (!song || !player) {
        return (
            <div className="flex flex-row items-center p-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <p className="text-2xl mx-2">-{'>'}</p>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-row items-center p-2 bg-white rounded-lg shadow-sm border">
            <div className="relative group">
                <img 
                    src={song.cover} 
                    alt={`${song.name} cover`}
                    className="w-8 h-8 rounded object-cover"
                />
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    <p className="font-medium">{song.name}</p>
                    <p className="text-gray-300">{song.artist}</p>
                </div>
            </div>
            
            <span className="text-2xl mx-3 text-gray-400">→</span>
            
            <div className="flex items-center">
                <span className="font-medium text-gray-800">{player.playerName}</span>
                <span className="ml-2 text-sm text-gray-500">({player.score} pts)</span>
            </div>
        </div>
    );
}

export default function VoteStatus() {
    const { playerID, votes } = useGameContext();
    
    const myVotes = votes.filter(vote => vote.voterID === playerID);
    
    if (myVotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <p className="text-lg">No votes cast yet</p>
                <p className="text-sm">Vote for songs to see your choices here</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Votes</h3>
            {myVotes.map((vote, index) => (
                <VoteItem key={`${vote.songID}-${vote.voteRecipientID}-${index}`} vote={vote} />
            ))}
        </div>
    );
}