export default async function handler(req, res) {
    // 1. Blokir jika bukan request POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Ambil Kunci Rahasia dari Environment Variables Vercel
    const VPS_DOMAIN = process.env.VPS_DOMAIN;
    const VPS_API_KEY = process.env.VPS_API_KEY;

    // Pastikan environment variables sudah di-set di Vercel
    if (!VPS_DOMAIN || !VPS_API_KEY) {
        return res.status(500).json({ 
            status: 'error', 
            message: 'Konfigurasi Server belum lengkap. Set VPS_DOMAIN dan VPS_API_KEY di Vercel.' 
        });
    }

    try {
        // 3. Tembak data ke VPS milikmu dengan API Key secara rahasia
        const response = await fetch(`https://${VPS_DOMAIN}/api/v1/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': VPS_API_KEY
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // 4. Kirim balasan dari VPS ke layar Website
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: "Gagal terhubung ke VPS: " + error.message 
        });
    }
}
