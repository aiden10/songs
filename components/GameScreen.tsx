
import { useGameContext } from "@/shared/GameContext"
import { Stages } from "@/shared/types";
import SongSelectStage from "./stages/SongSelect/SongSelectStage";
import VotingStage from "./stages/Voting/VotingStage";
import RevealStage from "./stages/Reveal/RevealStage";
import ResultsStage from "./stages/Results/ResultsStage";
import PlayerList from "./PlayerList";
import NameSelect from "./NameSelect";

export default function GameScreen() {
    const { stage, currentRound, roundsLimit } = useGameContext();

return <div>
        <NameSelect/>
        <div className="bg-amber-100 min-h-screen w-full p-4 gap-y-5 flex flex-col">
            {stage !== Stages.Results && <p className="text-[28px] text-black/50 font-bold ml-2 sm:absolute sm:right-5">
                    round {currentRound} of {roundsLimit} </p> }
            { stage !== Stages.Results && <PlayerList/>}
            { stage === Stages.SongSelect && <SongSelectStage/> }
            { stage === Stages.Voting && <VotingStage/> }
            { stage === Stages.Reveal && <RevealStage/> }
            { stage === Stages.Results && <ResultsStage/> }
        </div>
    </div>
}