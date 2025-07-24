
'use client'

import SongSearchBar from "./SongSearchBar";
import SongCarousel from "./SongCarousel";

export default function SongSelectStage() {
    return <div className="flex flex-col">
        <SongCarousel/>        
        <SongSearchBar/>
    </div>    
}