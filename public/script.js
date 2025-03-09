const socket = io();
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const wordDisplay = document.getElementById('word-display');
const cognateBtn = document.getElementById('cognate-btn');
const nonCognateBtn = document.getElementById('non-cognate-btn');
const scoreDisplay = document.getElementById('score');
const rankingList = document.getElementById('ranking-list');
const rankingBtn = document.getElementById('ranking-btn');

let playerName = '';
let currentWord = '';

startBtn.addEventListener('click', () => {
    playerName = usernameInput.value.trim();
    if (playerName) {
        socket.emit('newPlayer', playerName);
    }
});

socket.on('newWord', (data) => {
    currentWord = data.word;
    wordDisplay.textContent = currentWord;
    scoreDisplay.textContent = `Pontuação: ${data.score}`;
});

cognateBtn.addEventListener('click', () => {
    socket.emit('checkWord', { word: currentWord, isCognate: true });
});

nonCognateBtn.addEventListener('click', () => {
    socket.emit('checkWord', { word: currentWord, isCognate: false });
});

rankingBtn.addEventListener('click', () => {
    socket.emit('requestRanking');
});

socket.on('updateRanking', (ranking) => {
    rankingList.innerHTML = '';
    ranking.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name} - ${entry.score} pontos`;
        rankingList.appendChild(li);
    });
});