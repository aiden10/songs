
'use client'

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Stages, Player, Song, Vote, SocketEvents } from './types';

interface GameContextType {

  // State
    roomID: number;
    setRoomID: (id: number) => void;
    name: string;
    setName: (newName: string) => void;
    currentRound: number;
    setCurrentRound: React.Dispatch<React.SetStateAction<number>>
    host: boolean;
    setHost: (host: boolean) => void;
    stage: Stages;
    setStage: (stage: Stages) => void;
    players: Player[];
    setPlayers: (players: Player[]) => void;
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>
    votes: Vote[];
    setVotes: (votes: Vote[]) => void;
    playerID: number;
    setPlayerID: (id: number) => void;
    socket: WebSocket | null;
    setSocket: (socket: WebSocket | null) => void;
    roundsLimit: number;
    genreRestriction: string;

    // Actions
    submitSong: (song: Song) => void;
    submitVote: (selectedPlayer: Player, songID: number, voterID: number) => void;
    submitRestart: (rounds: number) => void;

    // Utility
    getPlayerData: (id: number) => Player | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [roomID, setRoomID] = useState(-1);
    const [name, setName] = useState("");
    const [currentRound, setCurrentRound] = useState(0);
    const [host, setHost] = useState(false);
    const [stage, setStage] = useState<Stages>(Stages.SongSelect);
    const [players, setPlayers] = useState<Player[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [playerID, setPlayerID] = useState(0);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const roundsLimit = useRef(0);
    const genreRestriction = useRef("");
    
    useEffect(() => {
        const randomName = `Guest#${Math.floor(Math.random() * 5000 + 1)}`;
        setName(randomName);
    }, []);

    // Socket event handlers
    const handleJoin = (eventData: SocketEvents['join']) => {
        setPlayerID(eventData.playerID);
        roundsLimit.current = eventData.rounds;
        setHost(eventData.host);
        genreRestriction.current = eventData.genreRestriction;
        let myPlayer: Player = {
            playerID: eventData.playerID,
            playerName: name,
            score: 0,
        };
        setPlayers(prev => [...prev, myPlayer]);
        setPlayers([myPlayer, ...eventData.existingPlayers]);
    };

    const handleOtherJoin = (eventData: SocketEvents['otherJoin']) => {
        const newPlayer: Player = {
            playerID: eventData.playerID,
            playerName: eventData.playerName,
            score: 0
        };
        setPlayers(prev => [...prev, newPlayer]);
    };

    const handleQuit = (eventData: SocketEvents['quit']) => {
        setPlayers(prev => prev.filter(player => player.playerID !== eventData.playerID));
        setSongs(prev => prev.filter(song => song.submitterID !== eventData.playerID));
    };

    const handleSongSubmitted = (eventData: SocketEvents['songSubmitted']) => {
        const newSong: Song = {
            songID: eventData.songID,
            name: eventData.name,
            artist: eventData.artist,
            genres: eventData.genres,
            cover: eventData.cover,
            previewURL: eventData.previewURL,
            submitterID: eventData.submitterID
        };
        setSongs(prev => [...prev, newSong]);
    };

    const handleVote = (eventData: SocketEvents['vote']) => {
        const newVote: Vote = {
            voterID: eventData.voterID,
            voteRecipientID: eventData.voteRecipientID,
            songID: eventData.songID
        };
        setVotes(prev => [...prev, newVote]);
    };

    const handleUpdateScores = (eventData: SocketEvents['updateScores']) => {
        setPlayers(prev => {
            const updatedPlayers = [...prev];
            eventData.newScores.forEach(scorePair => {
                    const playerIndex = updatedPlayers.findIndex(
                    player => player.playerID === scorePair.playerID
                );
                if (playerIndex !== -1) {
                    updatedPlayers[playerIndex] = {
                        ...updatedPlayers[playerIndex],
                        score: scorePair.newScore
                    };
                }
            });
        return updatedPlayers;
        });
    };

    const handleUpdateStage = (eventData: SocketEvents['updateStage']) => {
        setStage(eventData.newStage as Stages);
    };

    const handleUpdateGenreRestriction = (eventData: SocketEvents['updateGenreRestriction']) => {
        genreRestriction.current = eventData.genreRestriction;
    };
    
    const handleRestart = (eventData: SocketEvents['restart']) => {
        setVotes([]);
        setSongs([]);
        setCurrentRound(0);
        setStage(Stages.SongSelect);
        roundsLimit.current = eventData.rounds;
    };

    // Socket message handler
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
                case 'join':
                    handleJoin(message.data);
                    break;
                case 'otherJoin':
                    handleOtherJoin(message.data);
                    break;
                case 'quit':
                    handleQuit(message.data);
                    break;
                case 'songSubmitted':
                    handleSongSubmitted(message.data);
                    break;
                case 'vote':
                    handleVote(message.data);
                    break;
                case 'updateScores':
                    handleUpdateScores(message.data);
                    break;
                case 'updateStage':
                    handleUpdateStage(message.data);
                    break;
                case 'updateGenreRestriction':
                    handleUpdateGenreRestriction(message.data);
                    break;
                case 'restart':
                    handleRestart(message.data);
                    break;
                default:
                    console.warn('Unknown message type:', message.type);
            }
        };

        socket.addEventListener('message', handleMessage);
    
        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket]);

    const submitSong = (song: Song) => {
        if (socket) {
            socket.send(JSON.stringify({
                type: 'submitSong',
                data: song
            }));
        }
    };

    const submitVote = (selectedPlayer: Player, songID: number, voterID: number) => {
        const vote: Vote = {
            voterID: voterID,
            voteRecipientID: selectedPlayer.playerID,
            songID: songID
    };
        
        setVotes(prev => [...prev, vote]);
        
        if (socket) {
            socket.send(JSON.stringify({
                type: 'submitVote',
                data: vote
            }));
        }
    };

    const submitRestart = (rounds: number) => {
        if (socket) {
            socket.send(JSON.stringify({
                type: 'submitRestart',
                data: { rounds }
            }));
        }
    };

    // Utility functions
    const getPlayerData = (id: number): Player | undefined => {
        return players.find(player => player.playerID === id);
    };

    const value: GameContextType = {
        roomID,
        setRoomID,
        name,
        setName,
        currentRound,
        setCurrentRound,
        host,
        setHost,
        stage,
        setStage,
        players,
        setPlayers,
        songs,
        setSongs,
        votes,
        setVotes,
        playerID,
        setPlayerID,
        socket,
        setSocket,
        roundsLimit: roundsLimit.current,
        genreRestriction: genreRestriction.current,
        submitSong,
        submitVote,
        submitRestart,
        getPlayerData
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};