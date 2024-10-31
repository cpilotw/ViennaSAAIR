let currentLight = 24;
let lastSwitchTime = Date.now();
let skipped = false;
let startTime;
let reactionTimes = [];
let missedCount = 0;
let falsePressCount = 0;
let gameDuration;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function startGame() {
    const durationSelect = document.getElementById('duration');
    gameDuration = parseInt(durationSelect.value);
    document.getElementById('menu').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('gameTitle').innerText = 'press space bar'; // 修改標題
    document.getElementById('game').style.display = 'block';
    startTime = Date.now();
    runGame();
}

function runGame() {
    const interval = 1500;
    const gameEndTime = startTime + gameDuration * 1000;

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLights();
        
        const currentTime = Date.now();
        if (currentTime - lastSwitchTime >= interval) {
            if (Math.random() < 0.1) {
                skipped = true;
                currentLight = (currentLight + 2) % 32;
            } else {
                skipped = false;
                currentLight = (currentLight + 1) % 32;
            }
            lastSwitchTime = currentTime;
        }

        if (currentTime >= gameEndTime) {
            endGame();
            return;
        }

        requestAnimationFrame(gameLoop);
    }
    
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            if (skipped) {
                reactionTimes.push((Date.now() - lastSwitchTime) / 1000);
                skipped = false;
            } else {
                falsePressCount++;
            }
        }
    });

    gameLoop();
}

function drawLights() {
    const radiusBigCircle = 200;
    const radiusLight = 10;

    for (let i = 0; i < 32; i++) {
        const angle = (2 * Math.PI * i) / 32;
        const x = canvas.width / 2 + radiusBigCircle * Math.cos(angle);
        const y = canvas.height / 2 + radiusBigCircle * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, radiusLight, 0, 2 * Math.PI);
        ctx.fillStyle = (i === currentLight) ? 'white' : 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}

function endGame() {
    const averageReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length || 0;
    const totalErrors = missedCount + falsePressCount;
    const totalTrials = reactionTimes.length + totalErrors;
    const errorRatio = totalErrors / totalTrials || 0;

    document.getElementById('result').innerText = 
        `Game Over!\nAverage Reaction Time: ${averageReactionTime.toFixed(2)} seconds\nError Ratio: ${(errorRatio * 100).toFixed(2)}%`;
}

document.getElementById('startButton').addEventListener('click', startGame);
