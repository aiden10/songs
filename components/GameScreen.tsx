
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
        <PlayerList/>
        <div className="">
            Round {currentRound} of {roundsLimit}
        </div>
        { stage === Stages.SongSelect && <SongSelectStage/> }
        { stage === Stages.Voting && <VotingStage/> }
        { stage === Stages.Reveal && <RevealStage/> }
        { stage === Stages.Results && <ResultsStage/> }
    </div>
}