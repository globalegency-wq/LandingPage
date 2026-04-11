module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
      const errorData = await response.json();
      throw new Error(errorData.message || "فشل الاتصال بقاعدة البيانات");
    }

    return res.status(200).json({ success: true, message: "تم الإرسال بنجاح!" });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};
