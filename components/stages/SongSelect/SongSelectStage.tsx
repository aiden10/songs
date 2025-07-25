
'use client'
import SongSearchBar from "./SongSearchBar";
import SongCarousel from "./SongCarousel";

export default function SongSelectStage() {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center p-5 md:p-5 overflow-hidden ">
            <SongCarousel/>        
            <SongSearchBar/>
        </div>    
    );
}