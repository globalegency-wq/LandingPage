module.exports = async (req, res) => {
  // إعدادات الوصول
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { name, email, message } = req.body;

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "فشل في قاعدة البيانات");
    }

    return res.status(200).json({ success: true, message: "تم بنجاح" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
