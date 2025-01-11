const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('scores').select('*');
        if (error) {
            return res.status(500).json({ error: 'Error fetching data', details: error });
        }
        return res.status(200).json(data);
    } else if (req.method === 'POST') {
        const { scores, history } = req.body;

        // Inserta o actualiza datos en la tabla 'scores'
        const { error } = await supabase.from('scores').upsert({
            id: 1, // Asegúrate de usar un ID único o genera uno
            scores,
            history
        });

        if (error) {
            return res.status(500).json({ error: 'Error saving data', details: error });
        }
        return res.status(200).json({ message: 'Data saved successfully' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};
