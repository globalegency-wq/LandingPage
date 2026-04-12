module.exports = async (req, res) => {
  const { name, email, message, phone, lead_source } = req.body;

  // القيمة الافتراضية إذا كان المصدر فارغاً هي website
  const source = lead_source || 'website';

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ 
        name, 
        email, 
        message, 
        phone, 
        lead_source: source // تخزين مصدر العميل هنا
      })
    });

    if (!response.ok) throw new Error("فشل في تخزين البيانات");

    return res.status(200).json({ success: true, source_detected: source });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
