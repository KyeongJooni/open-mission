import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // URL에서 /api/proxy/ 이후의 경로 추출
  const url = req.url || '';
  const apiPath = url.replace(/^\/api\/proxy\/?/, '').split('?')[0];
  const queryString = url.includes('?') ? url.split('?')[1] : '';

  // 백엔드 서버 URL (환경변수로 관리)
  const BACKEND_URL = process.env.BACKEND_URL || process.env.VITE_API_BASE_URL;

  if (!BACKEND_URL) {
    return res.status(500).json({ error: 'BACKEND_URL is not configured' });
  }

  const targetUrl = `${BACKEND_URL}/${apiPath}${queryString ? `?${queryString}` : ''}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Authorization 헤더 전달
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization as string;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
