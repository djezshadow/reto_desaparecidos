const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '/data.json');

module.exports = (req, res) => {
    if (req.method === 'GET') {
        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading data' });
                return;
            }
            res.status(200).json(JSON.parse(data));
        });
    } else if (req.method === 'POST') {
        fs.writeFile(dataFilePath, JSON.stringify(req.body), (err) => {
            if (err) {
                res.status(500).json({ error: 'Error writing data' });
                return;
            }
            res.status(200).json({ message: 'Data saved successfully' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
