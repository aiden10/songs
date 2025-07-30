# About
Songuesser is a multiplayer browser game where players pick songs and then vote on who they think picked each song.

# Tech Stack
The front end is made with Next.js, React, TypeScript, Tailwind, and hosted with Vercel. The back end server uses Python, FastAPI, and is hosted on an AWS EC2 instance.

#  Song Selection Screen
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/a5bc640d-962f-45be-b5b5-19db5502cc1a" />

# Voting Screen
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/78ca8123-64a5-4d13-89fc-486149418e9b" />

# Reveal Screen
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/9c502413-d52d-422c-9a1a-2339e3b3863e" />

# Results Screen
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/f69c378c-7d4c-455a-94d4-2e0e65c57c5a" />

# Running locally
To run the front end:
- `npm install`
- `npm run dev`

To run the game server locally:
- Update shared/constants.ts urls to localhost 
- `cd server`
- `fastapi server.py`
