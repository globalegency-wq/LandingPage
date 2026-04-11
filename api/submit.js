module.exports = async (req, res) => {
  // تفعيل خيارات الوصول CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "الطريقة غير مسموح بها" });
  }

  const { name, email, message } = req.body;

  try {
    // الاتصال المباشر بـ API الخاص بـ Supabase
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
      const errorData = await response.json();
      throw new Error(errorData.message || "فشل الاتصال بقاعدة البيانات");
    }

    return res.status(200).json({ success: true, message: "تم إرسال طلبك بنجاح!" });
  } catch (err) {
    console.error("خطأ في المعالجة:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
};
