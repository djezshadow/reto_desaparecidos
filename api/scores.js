const data = await fetch('https://jruqvsmonxwttssqocje.supabase.co/rest/v1/countries', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpydXF2c21vbnh3dHRzc3FvY2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1NTUyMjYsImV4cCI6MjA1MjEzMTIyNn0.rysDT7oUSm3uI0-anwvhWGdx_c2l1i26eqdGjy582x0'
    }
  })
    .then(res => res.json())
    .catch(error => {
      // Handle error
    });

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
