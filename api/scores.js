import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase.from('scores').select('*');
            if (error) throw error;
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching data', error: error.message });
        }
    } else if (req.method === 'POST') {
        const { scores, history } = req.body;

        try {
            const { error } = await supabase.from('scores').upsert([
                { scores, history }
            ]);

            if (error) throw error;

            return res.status(200).json({ message: 'Data saved successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error saving data', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
