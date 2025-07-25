import { useGameContext } from "@/shared/GameContext";

export default function PlayerList() {
    const { players } = useGameContext();
    
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
    });

    return (
        <div className="flex flex-col bg-lime-300 rounded-md text-shadow-[0_0.9px_0.9px_rgba(0,0,0,0.7)] md:max-w-1/4 border-black border-4">
            {sortedPlayers.map((player, index) => (
                <div key={index} className=" flex flex-row justify-between items-center py-2 px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[24px] font-bold text-white">#{index + 1}</span>
                        <h2 className="text-[24px] text-white ml-2">{player.playerName}</h2>
                    </div>
                    <h1 className="text-[24px] font-bold text-lime-100">{player.score}</h1>
                </div>
            ))}
        </div>
    );
}