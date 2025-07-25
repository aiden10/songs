
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from enum import Enum
import json
import random

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
GENRES = ["rock", "pop", "alternative", "classical", "hip hop", "country", "r&b", "film"]
# electro, techno/house, dance, films/games, film scores, asian music
CORRECT_GUESS_REWARD = 5
CORRECT_GUESS_RECIPIENT_REWARD = 10

class Stages(Enum):
    SongSelect = 0
    Voting = 1
    Reveal = 2
    Results = 3

class CreateRoomBody(BaseModel):
    rounds: int

class PlayerInfo(BaseModel):
    name: str

class Player:
    def __init__(self, name: str, id: int, socket: WebSocket):
        self.name = name
        self.id = id
        self.score = 0
        self.socket = socket
        self.votes = []
        self.submitted_song = False
        self.done_reveal = False

class Room:
    def __init__(self, id: str, rounds: int):
        self.id = id
        self.rounds = rounds
        self.song_submissions = []
        self.votes = []
        self.genre_restriction = random.choice(GENRES)
        self.player_index = 0
        self.players = {}
        self.current_round = 1

# Global state
rooms_index = 0
rooms = {}

async def broadcast(data: dict, room: Room, sender: WebSocket = None):
    """Broadcast message to all players in room except sender"""
    for player in room.players.values():
        if player.socket != sender:
            try:
                await player.socket.send_text(json.dumps(data))
            except Exception as e:
                print(f"Error sending message to player {player.id}: {e}")

def all_songs_submitted(room: Room) -> bool:
    """Check if all players have submitted songs"""
    for player in room.players.values():
        if not player.submitted_song:
            return False
    return True

def all_votes_submitted(room: Room) -> bool:
    """Check if all players have voted for everyone"""
    for player in room.players.values():
        if len(player.votes) < len(room.players) - 1:
            return False
    return True

def all_players_done_reveal(room: Room) -> bool:
    for player in room.players.values():
        if not player.done_reveal:
            return False
    for player in room.players.values():
        player.done_reveal = False
    return True
    
def clear_songs(room: Room):
    """Reset song submission status for new round"""
    for player in room.players.values():
        player.submitted_song = False
    room.song_submissions = []

def clear_votes(room: Room):
    """Reset voting status for new round"""
    for player in room.players.values():
        player.votes = []
    room.votes = []

def calculate_scores(room: Room) -> list[dict]:
    """Calculate and update player scores based on votes"""
    new_scores = []
    
    # Award points for correct guesses
    for vote in room.votes:
        voter_id = vote["voterID"]
        vote_recipient_id = vote["voteRecipientID"]
        song_id = vote["songID"]
        
        # Find the actual submitter of this song
        actual_submitter = None
        for song in room.song_submissions:
            if song["songID"] == song_id:
                actual_submitter = song["submitterID"]
                break
        
        # If the vote was correct, award points
        if actual_submitter == vote_recipient_id:
            if voter_id in room.players:
                room.players[voter_id].score += CORRECT_GUESS_REWARD
            if vote_recipient_id in room.players:
                room.players[vote_recipient_id].score += CORRECT_GUESS_RECIPIENT_REWARD
    
    # Return updated scores
    for player in room.players.values():
        new_scores.append({"playerID": player.id, "newScore": player.score})
    
    return new_scores

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    player = None
    room = None
    
    try:
        # Get room
        if room_id in rooms:
            room = rooms[room_id]
        else:
            await websocket.send_text(json.dumps({
                "type": "error", 
                "message": "Room not found"
            }))
            
            return

        # Wait for player info
        player_info_data = await websocket.receive_text()
        player_info = json.loads(player_info_data)
        
        # Create player
        player = Player(player_info["name"], room.player_index, websocket)
        
        # Determine if player is host (first player)
        host = len(room.players) == 0
        
        # Send join confirmation to new player
        await websocket.send_text(json.dumps({
            "type": "join",
            "data": {
                "playerID": room.player_index,
                "host": host,
                "rounds": room.rounds,
                "genreRestriction": room.genre_restriction,
                "existingPlayers": [{"playerID": p.id, "playerName": p.name, "score": p.score} for p in room.players.values()]
            }
        }))
        
        # Notify other players
        await broadcast({
            "type": "otherJoin",
            "data": {
                "playerName": player_info["name"],
                "playerID": room.player_index
            }
        }, room, websocket)
        
        # Add player to room
        room.players[room.player_index] = player
        room.player_index += 1

        # Main message loop
        while True:
            request_data = await websocket.receive_text()
            message = json.loads(request_data)
            
            match message["type"]:                
                case "submitSong":
                    song_data = message["data"]
                    player_id = song_data["submitterID"]
                    
                    if player_id in room.players:
                        room.players[player_id].submitted_song = True
                        room.song_submissions.append(song_data)
                        
                        # Broadcast to other players
                        await broadcast({
                            "type": "songSubmitted",
                            "data": song_data
                        }, room, websocket)
                        
                        # Check if all songs submitted
                        if all_songs_submitted(room):
                            await broadcast({
                                "type": "updateStage",
                                "data": {"newStage": Stages.Voting.value}
                            }, room)

                case "submitVote":
                    vote_data = message["data"]
                    player_id = vote_data["voterID"]
                    
                    if player_id in room.players:
                        room.players[player_id].votes.append(vote_data)
                        room.votes.append(vote_data)
                        
                        # Broadcast to other players
                        await broadcast({
                            "type": "vote",
                            "data": vote_data
                        }, room, websocket)
                        
                        # Check if all votes submitted
                        if all_votes_submitted(room):
                            # Calculate scores
                            new_scores = calculate_scores(room)
                            await broadcast({
                                "type": "updateScores",
                                "data": {"newScores": new_scores}
                            }, room)
                            
                            # Move to reveal stage
                            await broadcast({
                                "type": "updateStage",
                                "data": {"newStage": Stages.Reveal.value}
                            }, room)
                            
                            # Update genre for next round
                            room.genre_restriction = random.choice(GENRES)
                            await broadcast({
                                "type": "updateGenreRestriction",
                                "data": {"genreRestriction": room.genre_restriction}
                            }, room)
                            clear_songs(room)
                            clear_votes(room)
                            room.current_round += 1

                case "submitDoneReveal":
                    reveal_data = message["data"]
                    player_id = reveal_data["playerID"]
                    room.players[player_id].done_reveal = True
                    if all_players_done_reveal(room):
                        stage = Stages.SongSelect.value
                        if room.current_round >= room.rounds: stage = Stages.Results.value
                        await broadcast({
                            "type": "updateStage",
                            "data": {"newStage": stage}
                        }, room)

                case "submitRestart":
                    restart_data = message["data"]
                    
                    # Reset room state
                    clear_votes(room)
                    clear_songs(room)
                    room.current_round = 0
                    room.rounds = restart_data["rounds"]
                    
                    # Reset player scores
                    for player in room.players.values():
                        player.score = 0
                    
                    await broadcast({
                        "type": "restart",
                        "data": {"rounds": restart_data["rounds"]}
                    }, room)

    except WebSocketDisconnect:
        if player and room:
            # Remove player from room
            if player.id in room.players:
                room.players.pop(player.id)
                
                # Notify other players
                await broadcast({
                    "type": "quit",
                    "data": {"playerID": player.id}
                }, room)
                
                # Remove room if empty
                if len(room.players) == 0:
                    print("Room closed")
                    rooms.pop(room_id, None)
            print(f"players: {len(room.players.values())}")
    
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.post("/rooms/create")
async def create_room(body: CreateRoomBody):
    global rooms_index
    
    room_id = str(rooms_index)
    rooms[room_id] = Room(room_id, body.rounds)
    rooms_index += 1
    
    return JSONResponse(
        content={"room_id": room_id}, 
        status_code=200
    )

