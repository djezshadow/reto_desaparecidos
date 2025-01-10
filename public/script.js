let history = [];

// URL de la API para guardar y cargar datos
const apiUrl = '/api/scores';

function updateScore(user, category, delta) {
    const element = document.getElementById(`${user}-${category}`);
    let currentScore = parseInt(element.innerText.split(' ')[0]);
    currentScore += delta;
    if (currentScore < 0) {
        currentScore = 0; // Asegura que el puntaje no sea negativo
    }
    element.innerText = `${currentScore} pts`;

    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    const entry = `${timestamp}: ${user} - ${delta > 0 ? 'Subió' : 'Bajó'} ${category} a ${currentScore} pts`;

    history.push(entry);
    displayHistory();

    // Guarda el puntaje y el historial usando la API
    saveData();
}

function displayHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = entry;
        historyList.appendChild(li);
    });
}

// Función para guardar datos
async function saveData() {
    const scores = {
        vicky: {
            texto: parseInt(document.getElementById('vicky-texto').innerText.split(' ')[0]),
            stickers: parseInt(document.getElementById('vicky-stickers').innerText.split(' ')[0]),
            llamada: parseInt(document.getElementById('vicky-llamada').innerText.split(' ')[0])
        },
        eze: {
            texto: parseInt(document.getElementById('eze-texto').innerText.split(' ')[0]),
            stickers: parseInt(document.getElementById('eze-stickers').innerText.split(' ')[0]),
            llamada: parseInt(document.getElementById('eze-llamada').innerText.split(' ')[0])
        }
    };
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scores, history })
    });
    const data = await response.json();
    console.log(data.message);
}

// Función para cargar datos
async function loadData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.scores) {
        for (let user in scores) {
            for (let category in scores[user]) {
                const element = document.getElementById(`${user}-${category}`);
                element.innerText = `${scores[user][category]} pts`;
            }
        }
    }};
