const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jruqvsmonxwttssqocje.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpydXF2c21vbnh3dHRzc3FvY2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1NTUyMjYsImV4cCI6MjA1MjEzMTIyNn0.rysDT7oUSm3uI0-anwvhWGdx_c2l1i26eqdGjy582x0';
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
