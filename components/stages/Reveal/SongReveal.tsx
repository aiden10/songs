import { CORRECT_GUESS_RECIPIENT_REWARD, CORRECT_GUESS_REWARD } from "@/shared/constants";
import { useGameContext } from "@/shared/GameContext";
import { Song } from "@/shared/types";

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
            <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Song data not available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            {/* Song cover and info */}
            <div className="relative mb-4">
                <img 
                    src={song.cover} 
                    alt={`${song.name} cover`}
                    className="w-64 h-64 object-cover rounded-lg shadow-md" 
                />
                
                {/* Audio preview */}
                {song.previewURL && (
                    <div className="mt-3">
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
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{song.name}</h2>
                <p className="text-lg text-gray-600 mb-2">{song.artist}</p>
                <p className="text-sm text-gray-500">{song.genres.join(', ')}</p>
            </div>

            {/* Reveal */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">
                    This song was chosen by... <span className="text-green-600">{songOwner.playerName}!</span>
                </h1>
            </div>

            {/* Correct guesses */}
            {correctGuessers.length > 0 && (
                <div className="w-full mb-4">
                    <h3 className="text-lg font-semibold text-green-600 mb-2 text-center">
                        🎉 Correct Guesses ({correctGuessers.length})
                    </h3>
                    <div className="bg-green-50 rounded-lg p-3">
                        {correctGuessers.map((player, index) => (
                            <div key={player!.playerID} className="flex items-center justify-between py-1">
                                <span className="font-medium text-green-800">{player!.playerName}</span>
                                <span className="text-sm text-green-600">+{CORRECT_GUESS_REWARD} pts</span>
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
                                <span className="text-gray-600"> guessed </span>
                                <span className="font-medium">{guess.guessedPlayer!.playerName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Score summary */}
            <div className="w-full bg-blue-50 rounded-lg p-3 mt-2">
                <div className="text-center">
                    <p className="text-sm text-blue-700">
                        <span className="font-medium">{songOwner.playerName}</span> earned 
                        <span className="font-bold text-blue-800"> +{correctGuessers.length * CORRECT_GUESS_RECIPIENT_REWARD} points</span> 
                        {correctGuessers.length === 1 ? ' (1 correct guess)' : ` (${correctGuessers.length} correct guesses)`}
                    </p>
                </div>
            </div>
        </div>
    );
}