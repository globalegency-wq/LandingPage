const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, email, message }]);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'تم الإرسال بنجاح' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
