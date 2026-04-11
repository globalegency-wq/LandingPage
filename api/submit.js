import { createClient } from '@supabase/supabase-js'

// جلب المتغيرات التي وضعتها في Vercel
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
    // التأكد أن الطلب من نوع POST (إرسال بيانات)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'الطريقة غير مسموح بها' })
    }

    try {
        const { name, email, message } = req.body

        // إدخال البيانات في جدول contacts الذي أنشأته
        const { data, error } = await supabase
            .from('contacts')
            .insert([{ name, email, message }])

        if (error) throw error

        return res.status(200).json({ success: true, message: 'تم استلام رسالتك بنجاح!' })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    }
}
