
import SongCarousel from "../SongSelect/SongCarousel"
import VoteStatus from "./VoteStatus"

export default function VotingStage() {
    return <div className="flex flex-col">
        <VoteStatus/>
        <SongCarousel/>
    </div>    
}