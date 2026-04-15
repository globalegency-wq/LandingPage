module.exports = async (req, res) => {
  const { name, email, message, phone, lead_source } = req.body;
  const source = lead_source || 'website';

  // --- بيانات التنبيه (استبدل القيم هنا) ---
  const TELEGRAM_TOKEN = '8363195341:AAFwOMBdtTn9JSdn7tYWT75cXwjdLv4ytxo';
  const CHAT_ID = '824678466'
  try {
    // 1. تخزين البيانات في Supabase
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
        lead_source: source 
      })
    });

    if (!response.ok) throw new Error("فشل في تخزين البيانات");

    // 2. إرسال التنبيه الفوري لتليجرام (الجزء الجديد)
    const alertText = `🚨 **عميل جديد لـ Global Agency**\n\n` +
                      `👤 الاسم: ${name}\n` +
                      `📞 الهاتف: ${email\n` +
                      `💼 الرسالة: ${message}\n` +
                      `🌍 المصدر: ${source}\n` +
                      `🕒 التاريخ: ${new Date().toLocaleString('ar-YE')}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: alertText,
        parse_mode: 'Markdown'
      })
    });

    return res.status(200).json({ success: true, source_detected: source });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
