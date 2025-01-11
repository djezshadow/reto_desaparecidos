import { createClient } from '@supabase/supabase-js';

// Asegúrate de que estas variables estén configuradas en el entorno de Vercel (SUPABASE_URL y SUPABASE_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL, // Supabase URL
  process.env.SUPABASE_KEY  // Supabase Key
);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Realiza la consulta para obtener los datos
            const { data, error } = await supabase.from('scores').select('*');
            if (error) throw error;
            return res.status(200).json(data); // Responde con los datos
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching data', error: error.message });
        }
    } else if (req.method === 'POST') {
        const { scores, history } = req.body; // Extrae los datos enviados en la petición

        try {
            // Realiza un upsert (insertar o actualizar) en la tabla 'scores'
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
