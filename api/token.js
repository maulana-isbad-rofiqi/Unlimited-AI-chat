export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return a dummy token or generate one. In production, use proper auth.
    const token = process.env.API_TOKEN || 'test-token-12345';
    res.status(200).json({ token });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
