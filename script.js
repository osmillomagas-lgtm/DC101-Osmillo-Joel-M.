const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');

// Game State Variables
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameSpeed = 5; // Pixels per game loop (difficulty)
let position = 10; // Starting bottom position of the dino (same as CSS bottom: 10px)

let gameInterval;
let obstacleInterval;
let scoreInterval;

// --- CORE GAME FUNCTIONS ---

// 1. Jump Function
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    let upInterval = setInterval(() => {
        if (position >= 100) { // Max height reached (100px)
            clearInterval(upInterval);
            // Start falling down
            let downInterval = setInterval(() => {
                if (position <= 10) { // Back to ground (10px)
                    clearInterval(downInterval);
                    isJumping = false;
                    dino.style.bottom = '10px'; // Ensure it snaps back to ground
                    return;
                }
                position -= 5; // Speed of falling
                dino.style.bottom = position + 'px';
            }, 20); // Fall speed (20ms interval)
        }
        position += 5; // Speed of rising
        dino.style.bottom = position + 'px';
    }, 20); // Jump speed (20ms interval)
}

// 2. Obstacle Movement & Collision Check
function moveObstacle() {
    let obstacleRight = -20; // Initial position (off-screen right)
    obstacle.style.right = obstacleRight + 'px';

    obstacleInterval = setInterval(() => {
        if (isGameOver) return;

        obstacleRight += gameSpeed; // Move left
        obstacle.style.right = obstacleRight + 'px';

        // Reset obstacle when it goes off-screen left
        if (obstacleRight >= 600) {
            obstacleRight = -15; // Reset position
            // Randomize next obstacle position/size (optional)
            // Para mas realistic, i-clear at mag-set ng bagong interval sa ibang time.
        }

        // --- COLLISION DETECTION ---
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Check for overlap:
        if (
            dinoRect.right > obstacleRect.left &&
            dinoRect.left < obstacleRect.right &&
            dinoRect.bottom > obstacleRect.top &&
            dinoRect.top < obstacleRect.bottom
        ) {
            // Collision detected!
            gameOver();
        }
    }, 20); // Game loop interval (20ms)
}

// 3. Score Updater
function updateScore() {
    scoreInterval = setInterval(() => {
        if (isGameOver) return;
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Optional: Increase difficulty (speed) every 100 points
        if (score % 100 === 0 && score > 0) {
            gameSpeed += 0.5;
        }
    }, 100); // Update score every 100ms
}

// 4. Game Over Logic
function gameOver() {
    isGameOver = true;
    clearInterval(obstacleInterval);
    clearInterval(scoreInterval);
    dino.style.backgroundColor = 'red'; // Visual feedback for collision
    gameOverScreen.classList.remove('hidden');
}

// 5. Start/Restart Game
function startGame() {
    // Reset state
    isGameOver = false;
    isJumping = false;
    score = 0;
    gameSpeed = 5;
    position = 10;

    scoreDisplay.textContent = 'Score: 0';
    dino.style.backgroundColor = '#555';
    dino.style.bottom = '10px';
    obstacle.style.right = '-20px';
    gameOverScreen.classList.add('hidden');

    // Start loops
    updateScore();
    moveObstacle();
}

// --- EVENT LISTENERS ---

// Trigger jump on Spacebar or Up Arrow
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (isGameOver) {
            // If game is over, restart instead of jumping
            startGame();
        } else {
            jump();
        }
    }
});

// Initial call to start the game when the page loads
startGame();