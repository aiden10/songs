
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { getSongs, SongOption, getFullSongData } from "@/shared/utils";
import { useGameContext } from "@/shared/GameContext";

export default function SongSearchBar() {
    const { 
        songs, 
        setSongs, 
        submitSong, 
        playerID, 
        genreRestriction 
    } = useGameContext();
    
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<SongOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSong, setSelectedSong] = useState<SongOption | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState<string>('');
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!query.trim()) {
            setOptions([]);
            setShowDropdown(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            setError('');
            try {
                const results = await getSongs(query);
                setOptions(results);
                setShowDropdown(results.length > 0);
            } 
            catch (err) {
                setError('Failed to search songs. Please try again.');
                setOptions([]);
                setShowDropdown(false);
            } 
            finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Check if player has already submitted a song
    useEffect(() => {
        const hasSubmitted = songs.some(song => song.submitterID === playerID);
        setDisabled(hasSubmitted);
    }, [songs, playerID]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectSong = async (option: SongOption) => {
        setQuery('');
        setShowDropdown(false);
        
        try {
            // Get full song data to check genres
            const fullSong = await getFullSongData(option.id, playerID);
            const alreadySubmitted = songs.some(s => s.songID === fullSong.songID);
            if (alreadySubmitted) {
                setError(`${fullSong.name} has already been submitted`);
                return;
            }
            // Check if song matches genre restriction
            if (genreRestriction && !fullSong.genres.some(genre => 
                genre.toLowerCase().includes(genreRestriction.toLowerCase())
            )) {
                setError(`Song must contain "${genreRestriction}" genre. This song has: ${fullSong.genres.join(', ')}`);
                return;
            }

            setSelectedSong(option);
            setError('');
        } 
        catch (err) {
            setError('Failed to load song details. Please try another song.');
        }
    };

    const handleSubmit = async () => {
        setShowDropdown(false);
        if (!selectedSong) {
            setError('Please select a song first.');
            return;
        }

        try {
            setLoading(true);
            const fullSong = await getFullSongData(selectedSong.id, playerID);
            
            // Double-check genre restriction
            if (genreRestriction && !fullSong.genres.some(genre => 
                genre.toLowerCase().includes(genreRestriction.toLowerCase())
            )) {
                setError(`Song must contain "${genreRestriction}" genre.`);
                return;
            }

            // Submit song
            setSongs(prev => [...prev, fullSong]);
            submitSong(fullSong);
            setDisabled(true);
            setError('');
            setQuery('');
            setSelectedSong(null);
            
        } 
        catch (err) {
            setError('Failed to submit song. Please try again.');
        } 
        finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && selectedSong && !disabled && !loading) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Genre restriction notice */}
            {genreRestriction && (
                <div className="mb-2 p-2 bg-amber-50 border-4 border-yellow-400 rounded md:text-[24px] text-yellow-400">
                    songs must contain genre: <strong>{genreRestriction}</strong>
                </div>
            )}

            {/* Search input */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="search for a song..."
                    disabled={disabled}
                    className={`
                        w-full px-4 py-2 border-4 rounded-md focus:outline-none focus:border-white
                         font-semibold md:text-[32px]
                        ${disabled ? 'bg-gray-100 cursor-not-allowed text-black/25 border-black/25' : 'bg-lime-300 text-white'}
                        ${error ? 'border-red-500' : 'border-black'}
                    `}
                />
                
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            {/* Dropdown with search results */}
            {showDropdown && !disabled && (
                <div ref={dropdownRef} className="absolute z-10 w-full max-h-60 overflow-y-auto
                bg-lime-300 border-4 border-black rounded-lg shadow-lg
                    scrollbar-thin scrollbar-thumb-lime-300 scrollbar-track-amber-100">
                    {options.map((option, index) => (
                        <button
                            key={`${option.id}-${index}`}
                            onClick={() => handleSelectSong(option)}
                            className="w-full px-4 py-2 text-left hover:bg-lime-200 focus:bg-gray-100 focus:outline-none border-2 border-black last:border-b-0"
                        >
                            <div className="font-bold text-white">{option.title}</div>
                            <div className="text-sm font-semibold text-white">{option.artist}</div>
                        </button>
                    ))}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mt-2 p-2 bg-red-100 border-4 border-red-500 rounded text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                disabled={!selectedSong || disabled || loading}
                className={`
                    w-full mt-3 px-4 py-2 rounded-sm transition-colors border-4 font-semibold
                    ${!selectedSong || disabled || loading
                        ? 'bg-lime-200/80 text-black/50 cursor-not-allowed border-black/50'
                        : 'bg-lime-300 text-black hover:bg-lime-300/75 focus:outline-none border-black hover:cursor-pointer'
                    }
                `}
            >
                {loading ? 'Loading...' : disabled ? 'Song Submitted' : 'Submit Song'}
            </button>

            {/* Selected song preview */}
            {selectedSong && !disabled && (
                <div className="mt-2 p-2 bg-amber-50 border-4 border-yellow-400 rounded text-sm">
                    <div className="font-semibold text-black">Selected: {selectedSong.title}</div>
                    <div className="text-black">by {selectedSong.artist}</div>
                </div>
            )}
        </div>
    );
}