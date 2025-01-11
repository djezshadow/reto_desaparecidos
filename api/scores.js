const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlljopsfuyhxfuhwjlux.supabase.co';
const supabaseKey = 'tJqGoNFHLgCHoEAGf5o2ufBnljVoWTkHy7n4ZYruBpndvmKP7DzgMUmX2DN5AiRQnmcgGbBPovhwLrT+n2vIOA==';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('scores').select('*');
        if (error) {
            res.status(500).json({ error: 'Error fetching scores' });
            return;
        }
        res.status(200).json({ scores: data });
    } else if (req.method === 'POST') {
        const { scores } = req.body;
        const updates = Object.keys(scores).map(user => {
            return Object.entries(scores[user]).map(([category, score]) => ({
                user,
                category,
                score,
            }));
        }).flat();

        const { error } = await supabase.from('scores').upsert(updates);
        if (error) {
            res.status(500).json({ error: 'Error saving scores' });
            return;
        }
        res.status(200).json({ message: 'Scores saved successfully' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
