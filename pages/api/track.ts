
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Missing track ID' });
    }

    try {
        const response = await fetch(`https://api.deezer.com/track/${id}`);
        const data = await response.json();
        res.status(200).json(data);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Deezer track' });
    }
}
