module.exports = async (req, res) => {
  // استقبال الـ 4 حقول الأساسية فقط
  const { name, email, message, lead_source } = req.body;
  const source = lead_source || 'website';

  const TELEGRAM_TOKEN = '8363195341:AAFwOMBdtTn9JSdn7tYWT75cXwjdLv4ytxo';
  const CHAT_ID = '8389021637';

  try {
    // إرسال البيانات لـ Supabase
    // تأكد أن أسماء الأعمدة هنا تطابق تماماً ما في الجدول لديك
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ 
        name: name, 
        email: email, // الهاتف مخزن في عمود الايميل
        message: message, 
        lead_source: source
      })
    });

    if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Supabase Error:", errorDetail);
        throw new Error("فشل في تخزين البيانات في قاعدة البيانات");
    }

    // إرسال التنبيه لتليجرام
    const alertText = `🚨 **طلب جديد لـ Global Agency**\n\n` +
                      `👤 الاسم: ${name}\n` +
                      `📞 الهاتف: https://wa.me/${email}\n` +
                      `💼 الرسالة: ${message}\n` +
                      `🌍 المصدر: ${source}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: alertText, parse_mode: 'Markdown' })
    });

    res.status(200).json({ message: 'تم الإرسال بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
