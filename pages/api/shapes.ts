import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = 'QHQ3UAVQFEDFAIVKNFCY5XIRSXHLLCWNRR6NFN03UVO';
  const { message } = req.body;

  try {
    const apiRes = await fetch('https://api.shapes.inc/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'shapesinc/janseva',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for Jansevakendra, a service center that provides various government and utility services. You should be friendly, professional, and knowledgeable about the services offered.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const contentType = apiRes.headers.get('content-type');
    const raw = await apiRes.text();

    if (!apiRes.ok) {
      console.error('Shapes API error:', raw);
      return res.status(apiRes.status).json({ error: 'Shapes API error', details: raw });
    }

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(raw);
      return res.status(apiRes.status).json(data);
    } else {
      // Not JSON, return as text
      return res.status(apiRes.status).send(raw);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 