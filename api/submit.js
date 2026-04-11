const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // تفعيل CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'POST') {
    try {
      // استخراج البيانات والتأكد من وجودها
      const { name, email, message } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "الاسم والبريد مطلوبان" });
      }

      // محاولة الإدخال في الجدول
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          { 
            name: name, 
            email: email, 
            message: message 
          }
        ]);

      if (error) {
        console.error("Supabase Error:", error.message);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ success: true, message: 'تم الإرسال بنجاح!' });

    } catch (err) {
      console.error("Server Error:", err.message);
      return res.status(500).json({ error: "حدث خطأ في السيرفر: " + err.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
