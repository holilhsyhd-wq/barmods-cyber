export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const VPS_DOMAIN = process.env.VPS_DOMAIN;
    const VPS_API_KEY = process.env.VPS_API_KEY;

    if (!VPS_DOMAIN || !VPS_API_KEY) {
        return res.status(500).json({ 
            status: 'error', 
            message: 'Konfigurasi Server belum lengkap. Set VPS_DOMAIN dan VPS_API_KEY di Vercel.' 
        });
    }

    try {
        // PERBAIKAN DI SINI: Menggunakan http:// agar sinkron dengan Tembok Badak HAProxy Port 80
        const response = await fetch(`http://${VPS_DOMAIN}/api/v1/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': VPS_API_KEY
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: "Gagal terhubung ke VPS: " + error.message 
        });
    }
}
