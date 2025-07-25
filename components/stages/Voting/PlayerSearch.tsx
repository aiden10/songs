
import React, { useState, useEffect } from 'react';
import { useGameContext } from "@/shared/GameContext";
import { Player } from "@/shared/types";

interface PlayerSearchProps {
    songID: number;
}

export default function PlayerSearch({ songID }: PlayerSearchProps) {
    const { 
        players, 
        submitVote, 
        playerID,
        votes,
        songs
    } = useGameContext();
    
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const filteredPlayers = players
        .filter(player => player.playerID !== playerID) // Can't vote for yourself
        .filter(player => 
            player.playerName.toLowerCase().includes(query.toLowerCase())
        );

    // Check if player has already voted for this song
    useEffect(() => {
        const hasVoted = votes.some(vote => 
            vote.voterID === playerID && vote.songID === songID
        );
        const submittedSong = songs.find(s => s.submitterID === playerID);
        if (submittedSong)
            setDisabled(submittedSong.songID === songID || hasVoted)
        else
            setDisabled(hasVoted);
    }, [votes, playerID, songID]);

    const handleSelectPlayer = (player: Player) => {
        setSelectedPlayer(player);
        setQuery(player.playerName);
        setShowDropdown(false);
    };

    const handleSubmitVote = () => {
        if (!selectedPlayer) return;
        
        submitVote(selectedPlayer, songID, playerID);
        setDisabled(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowDropdown(true);
        
        // Clear selection if query doesn't match selected player
        if (selectedPlayer && !selectedPlayer.playerName.toLowerCase().includes(e.target.value.toLowerCase())) {
            setSelectedPlayer(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && selectedPlayer && !disabled) {
            e.preventDefault();
            handleSubmitVote();
        }
    };

    const handleFocus = () => {
        if (!disabled) {
            setShowDropdown(true);
        }
    };

    const handleBlur = () => {
        // Delay hiding dropdown to allow for clicks
        setTimeout(() => setShowDropdown(false), 150);
    };

    return (
        <div className="relative w-full max-w-xs">
            {/* Input field */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Who chose this song?"
                    disabled={disabled}
                    className={`
                        w-full px-3 py-2 text-sm border-4 rounded-md focus:outline-none  
                        ${disabled ? 'bg-lime-100 cursor-not-allowed text-black/50' : 'bg-lime-200'}
                        ${selectedPlayer ? 'border-black' : 'border-black/25'}
                    `}
                />
                
                {/* Selected indicator */}
                {selectedPlayer && !disabled && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                )}
            </div>

            {/* Dropdown with player options */}
            {showDropdown && !disabled && filteredPlayers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-lime-200 border-4 border-black rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredPlayers.map((player) => (
                        <button
                            key={player.playerID}
                            onClick={() => handleSelectPlayer(player)}
                            className={`
                                w-full px-3 py-2 text-left text-sm hover:bg-lime-100 focus:outline-none
                                ${selectedPlayer?.playerID === player.playerID ? 'bg-lime-200' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium ">{player.playerName}</span>
                                <span className="text-xs ">{player.score} pts</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No players message */}
            {showDropdown && !disabled && filteredPlayers.length === 0 && query && (
                <div className="absolute z-10 w-full mt-1 bg-lime-200 border-4 border-black rounded-md shadow-lg p-2">
                    <div className="text-sm text-center">No players found</div>
                </div>
            )}

            {/* Submit button */}
            <button
                onClick={handleSubmitVote}
                disabled={!selectedPlayer || disabled}
                className={`
                    w-full mt-2 px-3 py-2 text-sm font-medium rounded-md transition-colors border-4
                    ${!selectedPlayer || disabled
                        ? 'bg-lime-200 text-black/50 cursor-not-allowed border-black/25'
                        : 'bg-lime-500 text-white hover:bg-lime-500/50 focus:outline-none hover:cursor-pointer border-black'
                    }
                `}
            >
                {disabled ? 'Vote Submitted' : 'Vote'}
            </button>

            {/* Vote confirmation */}
            {disabled && (
                <div className="mt-1 text-xs text-white font-semibold text-center">
                    ✓ Voted for {selectedPlayer?.playerName || 'player'}
                </div>
            )}
        </div>
    );
}
