module.exports = async (req, res) => {
  // 1. استقبال البيانات من الطلب (أضفنا interest_score هنا)
  const { name, email, message,  lead_source, interest_score } = req.body;
  const source = lead_source || 'website';
  // التأكد من تحويل النقاط لرقم، وإذا لم توجد نضع 0
  const score = parseInt(interest_score) || 0; 

  const TELEGRAM_TOKEN = '8363195341:AAFwOMBdtTn9JSdn7tYWT75cXwjdLv4ytxo';
  const CHAT_ID = '8389021637';

  try {
    // 2. تخزين البيانات في Supabase (تم إضافة interest_score للـ body)
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
        lead_source: source,
        interest_score: score // إرسال النقاط المحفوظة إلى العمود الجديد
      })
    });

    if (!response.ok) throw new Error("فشل في تخزين البيانات");

    // 3. إرسال التنبيه الفوري لتليجرام (أضفنا تقييم العميل في الرسالة)
    // تحديد "درجة الحرارة" للعميل بناءً على النقاط
    const leadStatus = score >= 70 ? "🔥 مهتم جداً" : score >= 30 ? "⚡ مهتم" : "❄️ بارد";

    const alertText = `🚨 **عميل جديد لـ Global Agency**\n\n` +
                      `👤 الاسم: ${name}\n` +
                      `📞 الهاتف: https://wa.me/${email}\n` +
                      `📊 تقييم الاهتمام: ${score} (${leadStatus})\n` + // إضافة النقاط هنا
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
