
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchQuery } = req.query;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    try {
        const response = await fetch(`https://api.deezer.com/search?q=${searchQuery}`);
        const data = await response.json();
        res.status(200).json(data);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Deezer tracks' });
    }
}
