import { createClient } from '@supabase/supabase-js';

// Asegúrate de que estás usando las variables de entorno
const supabase = createClient(
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.SUPABASE_JWT_SECRET,
    process.env.POSTGRES_USER,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.POSTGRES_PASSWORD,
    process.env.POSTGRES_DATABASE,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.POSTGRES_HOST,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_URL
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
