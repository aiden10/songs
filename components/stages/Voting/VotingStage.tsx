
import SongCarousel from "../SongSelect/SongCarousel"
import VoteStatus from "./VoteStatus"

export default function VotingStage() {
    return <div className="flex flex-col gap-y-5 items-center w-full">
        <VoteStatus/>
        <SongCarousel/>
    </div>    
}