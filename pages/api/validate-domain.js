export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'GET') {
    // 允许所有域名
    res.json({
      allowed: true,
      message: '所有域名都被允许'
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
} 