
import { Song } from './types';
import { API_ALBUM_URL, API_TRACK_URL, API_SEARCH_URL, CREATE_ROOM_ENDPOINT } from './constants';

export interface SongOption {
    title: string;
    artist: string;
    id: number;
}

export interface CreateRoomResponse {
    room_id: string;
}

export async function createRoom(rounds: number): Promise<CreateRoomResponse> {
    try {
        const response = await fetch(CREATE_ROOM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rounds }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create room: ${response.statusText}`);
        }

        return await response.json();
    } 
    catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
}

async function getAlbumInfo(albumId: number): Promise<{ cover: string; genres: string[] }> {
    try {
        const res = await fetch(`${API_ALBUM_URL}?id=${albumId}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch album data: ${res.statusText}`);
        }
        const albumData = await res.json();
        
        const genres = albumData.genres?.data?.map((genre: any) => genre.name) || [];
        const cover = albumData.cover_big || albumData.cover_medium || albumData.cover || '';
        
        return { cover, genres };
    } 
    catch (error) {
        console.error('Error fetching album info:', error);
        return { cover: '', genres: [] };
    }
}

export async function getFullSongData(id: number, playerID: number): Promise<Song> {
    try {
        const res = await fetch(`${API_TRACK_URL}?id=${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch song data: ${res.statusText}`);
        }
        const data = await res.json();
        
        let artistName = '';
        if (data.contributors && data.contributors.length > 0) {
            artistName = data.contributors.map((artist: any) => artist.name).join(', ');
        } 
        else if (data.artist && data.artist.name) {
            artistName = data.artist.name;
        } 
        else {
            artistName = 'Unknown Artist';
        }
        
        const albumId = data.album?.id;
        const { cover, genres } = albumId ? await getAlbumInfo(albumId) : { cover: '', genres: [] };
        
        const song: Song = {
            songID: id,
            name: data.title || 'Unknown Title',
            artist: artistName,
            genres: genres,
            cover: cover,
            previewURL: data.preview || '',
            submitterID: playerID
        };
        return song;
    } 
    catch (error) {
        console.error('Error fetching song data:', error);
        throw error;
    }
}

export async function getSongs(query: string): Promise<SongOption[]> {
    if (!query.trim()) {
        return [];
    }
    
    try {
        const res = await fetch(`${API_SEARCH_URL}?searchQuery=${encodeURIComponent(query)}`);
        if (!res.ok) {
        throw new Error(`Failed to search songs: ${res.statusText}`);
        }
        const searchData = await res.json();
        
        const tracks = searchData.data || [];
        
        const songs: SongOption[] = tracks.map((track: any) => ({
            title: track.title || 'Unknown Title',
            artist: track.artist?.name || 'Unknown Artist',
            id: track.id
        }));
        
        return songs;
    } 
    catch (error) {
        console.error('Error searching songs:', error);
        return [];
    }
}