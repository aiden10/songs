
'use client'
import SongSearchBar from "./SongSearchBar";
import SongCarousel from "./SongCarousel";

export default function SongSelectStage() {
    return (
        <div className="flex flex-col h-full gap-4 sm:gap-6 place-items-center">
            <div className="flex-1 min-h-0 ">
                <SongCarousel/>
            </div>
            
            <div className="flex px-2 py-5 sm:px-4">
                <div className="w-full max-w-md">
                    <SongSearchBar/>
                </div>
            </div>
        </div>
    );
}