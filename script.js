/* script.js */
let history = [];

// Referencia a la base de datos
const database = firebase.database();

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

    // Guarda el puntaje y el historial en Firebase
    database.ref(`scores/${user}/${category}`).set(currentScore);
    database.ref('history').set(history);
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

// Carga los datos desde Firebase al iniciar
database.ref('scores').on('value', (snapshot) => {
    const scores = snapshot.val();
    for (let user in scores) {
        for (let category in scores[user]) {
            const element = document.getElementById(`${user}-${category}`);
            element.innerText = `${scores[user][category]} pts`;
        }
    }
});
