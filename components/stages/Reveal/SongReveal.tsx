import { CORRECT_GUESS_RECIPIENT_REWARD, CORRECT_GUESS_REWARD } from "@/shared/constants";
import { useGameContext } from "@/shared/GameContext";
import { Song } from "@/shared/types";
import Image from "next/image";

interface SongRevealProps {
    song: Song;
}

export default function SongReveal({ song }: SongRevealProps) {
    const { getPlayerData, votes } = useGameContext();
    
    const songOwner = getPlayerData(song.submitterID);
    
    const songVotes = votes.filter(vote => vote.songID === song.songID);
    
    const correctGuessers = songVotes
        .filter(vote => vote.voteRecipientID === song.submitterID)
        .map(vote => getPlayerData(vote.voterID))
        .filter(player => player !== undefined);
    
    const incorrectGuessers = songVotes
        .filter(vote => vote.voteRecipientID !== song.submitterID)
        .map(vote => ({
            voter: getPlayerData(vote.voterID),
            guessedPlayer: getPlayerData(vote.voteRecipientID)
        }))
        .filter(guess => guess.voter && guess.guessedPlayer);

    if (!songOwner) {
        return (
            <div className="flex flex-col items-center p-6 bg-gray-300 rounded-lg">
                <p className="text-black">Song data not available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center sm:p-4 p-2 bg-lime-300 rounded-md border-4 w-full max-w-xl">
            {/* Song cover and info */}
            <div className="relative sm:mb-4 mb-2 items-center">
                <Image
                    src={song.cover}
                    alt={`${song.name} cover`}
                    width={256}
                    height={256}
                    className="w-48 sm:w-48 md:w-52 lg:w-44 h-48 sm:h-48 md:h-52 lg:h-44 object-cover rounded-sm mx-auto border-4 border-white"
                />                
                {/* Audio preview */}
                {song.previewURL && (
                    <div className="sm:mt-3 mt-2 rounded-md">
                        <audio 
                            controls 
                            src={song.previewURL}
                            className="w-full"
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>

            {/* Song details */}
            <div className="text-center sm:mb-4 mb-2 border-4 bg-amber-50 sm:p-3 p-2">
                <h2 className="text-white font-semibold bg-black/50 sm:px-5 px-3 border-4 border-black rounded-xs sm:my-1 my-0.5 sm:text-base text-sm">title: {song.name}</h2>
                <p className="text-white font-semibold bg-black/50 sm:px-5 px-3 border-4 border-black rounded-xs sm:my-1 my-0.5 sm:text-base text-sm">artist: {song.artist}</p>
                <p className="text-white font-semibold bg-black/50 sm:px-5 px-3 border-4 border-black rounded-xs sm:my-1 my-0.5 sm:text-base text-sm">genres: {song.genres.join(', ')}</p>
            </div>

            {/* Reveal */}
            <div className="text-center sm:mb-6 mb-3">
                <h1 className="sm:text-2xl text-xl font-bold text-black sm:mb-4 mb-2 border-4 border-black sm:p-3 p-2 bg-amber-50">
                    This song was chosen by... <span className="text-green-600">{songOwner.playerName}!</span>
                </h1>
            </div>

            {/* Correct guesses */}
            {correctGuessers.length > 0 && (
                <div className="w-full sm:mb-4 mb-2">
                    <h3 className="sm:text-lg text-base font-semibold text-black sm:mb-2 mb-1 text-center">
                        🎉 Correct Guesses ({correctGuessers.length})
                    </h3>
                    <div className="bg-amber-50 rounded-sm sm:p-3 p-2 border-4 border-black max-h-32 overflow-y-auto">
                        {correctGuessers.map((player) => (
                            <div key={player!.playerID} className="flex items-center justify-between sm:py-1 py-0.5">
                                <span className="font-medium text-black sm:text-base text-sm">{player!.playerName}</span>
                                <span className="sm:text-sm text-xs text-lime-500">+{CORRECT_GUESS_REWARD} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Incorrect guesses */}
            {incorrectGuessers.length > 0 && (
                <div className="w-full sm:mb-4 mb-2">
                    <h3 className="sm:text-lg text-base font-semibold text-red-600 sm:mb-2 mb-1 text-center">
                        ❌ Incorrect Guesses ({incorrectGuessers.length})
                    </h3>
                    <div className="bg-amber-50 rounded-md sm:p-3 p-2 border-4 border-black max-h-32 overflow-y-auto">
                        {incorrectGuessers.map((guess, index) => (
                            <div key={`${guess.voter!.playerID}-${index}`} className="sm:py-1 py-0.5 sm:text-sm text-xs text-red-700">
                                <span className="font-medium">{guess.voter!.playerName}</span>
                                <span className="text-black"> guessed </span>
                                <span className="font-medium">{guess.guessedPlayer!.playerName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Score summary */}
            <div className="w-full bg-amber-50 rounded-sm border-4 border-black sm:p-3 p-2 sm:mt-2 mt-1">
                <div className="text-center">
                    <p className="sm:text-sm text-xs text-black/50">
                        <span className="font-medium">{songOwner.playerName}</span> earned 
                        <span className="font-bold text-lime-400/80"> +{correctGuessers.length * CORRECT_GUESS_RECIPIENT_REWARD} points</span> 
                        {correctGuessers.length === 1 ? ' (1 correct guess)' : ` (${correctGuessers.length} correct guesses)`}
                    </p>
                </div>
            </div>
        </div>
    );
}