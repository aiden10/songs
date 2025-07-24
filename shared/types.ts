
export interface Player {
    playerID: number;
    playerName: string;
    score: number;
}

export interface Song {
    songID: number;
    name: string;
    artist: string;
    genres: string[];
    cover: string;
    previewURL: string;
    submitterID: number;
}

export interface Vote {
    voterID: number;
    voteRecipientID: number;
    songID: number;
}

export enum Stages {
    SongSelect = 0,
    Voting = 1,
    Reveal = 2,
    Results = 3
}

// Socket event types
export interface SocketEvents {
    join: {
        playerID: number;
        rounds: number;
        genreRestriction: string;
        host: boolean;
    };
    otherJoin: {
        playerName: string;
        playerID: number;
    };
    quit: {
        playerID: number;
    };
    songSubmitted: {
        name: string;
        artist: string;
        genres: string[];
        cover: string;
        previewURL: string;
        songID: number;
        submitterID: number;
    };
    vote: {
        songID: number;
        voteRecipientID: number;
        voterID: number;
    };
    updateScores: {
        newScores: Array<{playerID: number; newScore: number}>;
    };
    updateStage: {
        newStage: number;
    };
    updateGenreRestriction: {
        genreRestriction: string;
    };
    restart: {
        rounds: number;
    };
}