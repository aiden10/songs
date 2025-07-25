
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
        <div className="flex flex-col items-center p-4 bg-lime-300 rounded-md border-4 w-full max-w-xl overflow-y-auto">
            {/* Song cover and info */}
            <div className="relative mb-4 items-center">
                <Image
                    src={song.cover}
                    alt={`${song.name} cover`}
                    width={256}
                    height={256}
                    className="w-48 sm:w-64 h-48 sm:h-64 object-cover rounded-sm mx-auto"
                />                
                {/* Audio preview */}
                {song.previewURL && (
                    <div className="mt-3 rounded-md">
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
            <div className="text-center mb-4 border-4 bg-amber-50 p-3">
                <h2 className="text-white font-semibold bg-black/50 px-5 border-4 border-black rounded-xs my-1">title: {song.name}</h2>
                <p className="text-white font-semibold bg-black/50 px-5 border-4 border-black rounded-xs my-1">artist: {song.artist}</p>
                <p className="text-white font-semibold bg-black/50 px-5 border-4 border-black rounded-xs my-1">genres: {song.genres.join(', ')}</p>
            </div>

            {/* Reveal */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-black mb-4 border-4 border-black p-3 bg-amber-50">
                    This song was chosen by... <span className="text-green-600">{songOwner.playerName}!</span>
                </h1>
            </div>

            {/* Correct guesses */}
            {correctGuessers.length > 0 && (
                <div className="w-full mb-4">
                    <h3 className="text-lg font-semibold text-black mb-2 text-center">
                        🎉 Correct Guesses ({correctGuessers.length})
                    </h3>
                    <div className="bg-amber-50 rounded-sm p-3 border-4 border-black">
                        {correctGuessers.map((player) => (
                            <div key={player!.playerID} className="flex items-center justify-between py-1">
                                <span className="font-medium text-black">{player!.playerName}</span>
                                <span className="text-sm text-lime-500">+{CORRECT_GUESS_REWARD} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Incorrect guesses */}
            {incorrectGuessers.length > 0 && (
                <div className="w-full mb-4">
                    <h3 className="text-lg font-semibold text-red-600 mb-2 text-center">
                        ❌ Incorrect Guesses ({incorrectGuessers.length})
                    </h3>
                    <div className="bg-red-50 rounded-lg p-3">
                        {incorrectGuessers.map((guess, index) => (
                            <div key={`${guess.voter!.playerID}-${index}`} className="py-1 text-sm text-red-700">
                                <span className="font-medium">{guess.voter!.playerName}</span>
                                <span className="text-black"> guessed </span>
                                <span className="font-medium">{guess.guessedPlayer!.playerName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Score summary */}
            <div className="w-full bg-amber-50 rounded-sm border-4 border-black p-3 mt-2">
                <div className="text-center">
                    <p className="text-sm text-black/50">
                        <span className="font-medium">{songOwner.playerName}</span> earned 
                        <span className="font-bold text-lime-400/80"> +{correctGuessers.length * CORRECT_GUESS_RECIPIENT_REWARD} points</span> 
                        {correctGuessers.length === 1 ? ' (1 correct guess)' : ` (${correctGuessers.length} correct guesses)`}
                    </p>
                </div>
            </div>
        </div>
    );
}