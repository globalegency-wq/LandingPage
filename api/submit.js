const https = require('https');

module.exports = async (req, res) => {
    // تفعيل CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { name, email, message } = req.body;
    const postData = JSON.stringify({ name, email, message });

    // استخراج الدومين من الرابط (حذف https://)
    const supabaseHost = process.env.SUPABASE_URL.replace('https://', '');

    const options = {
        hostname: supabaseHost,
        path: '/rest/v1/contacts',
        method: 'POST',
        headers: {
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const request = https.request(options, (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            res.status(200).json({ success: true, message: "تم الإرسال بنجاح!" });
        } else {
            res.status(response.statusCode).json({ error: "خطأ من Supabase" });
        }
    });

    request.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    request.write(postData);
    request.end();
};
