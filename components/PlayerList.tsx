import { useGameContext } from "@/shared/GameContext";

export default function PlayerList() {
    const { players } = useGameContext();
    
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
    });

    return (
        <div className="flex flex-col">
            {sortedPlayers.map((player, index) => (
                <div key={index} className="flex flex-row justify-between items-center p-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                        <h2 className="px-3 py-1 text-lg font-medium">{player.playerName}</h2>
                    </div>
                    <h1 className="text-xl font-bold text-blue-600">{player.score}</h1>
                </div>
            ))}
        </div>
    );
}