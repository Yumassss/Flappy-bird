const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Muat gambar burung
const birdImage = new Image();
birdImage.src = "image/bird.png";

// Login Functionality
document.getElementById("loginButton").addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Valid username and password
  const validUsername = "player";
  const validPassword = "1234";

  if (username === validUsername && password === validPassword) {
    alert("Login Successful!");
    document.getElementById("loginForm").style.display = "none";
    canvas.style.display = "block";
    startGame(); // Start the game after login
  } else {
    alert("Invalid Username or Password!");
  }
});

// Game Variables
const gravity = 0.6;
const jump = -10;
const pipeGap = 120;
const pipeWidth = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
let score = 0;
const pipes = [];
let isGameOver = false;

// Initialize the first pipe
pipes.push({
  x: canvas.width,
  height: randomPipeHeight(),
});

// Game Loop
function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Bird (gunakan gambar burung)
  ctx.drawImage(birdImage, 35, birdY - 15, 30, 30);

  // Apply Gravity
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Check for Collision with Ground or Ceiling
  if (birdY + 15 > canvas.height || birdY - 15 < 0) {
    endGame();
  }

  // Draw and Update Pipes
  ctx.fillStyle = "green";
  pipes.forEach((pipe, index) => {
    // Draw Top Pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

    // Draw Bottom Pipe
    ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height);

    // Move Pipe to the Left
    pipe.x -= 2;

    // Check for Collision with Pipes
    if (
      50 + 15 > pipe.x &&
      50 - 15 < pipe.x + pipeWidth &&
      (birdY - 15 < pipe.height || birdY + 15 > pipe.height + pipeGap)
    ) {
      endGame();
    }

    // Add New Pipes and Update Score
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      pipes.push({
        x: canvas.width,
        height: randomPipeHeight(),
      });
      score++;
    }
  });

  // Draw Score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Handle Key Press
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") birdVelocity = jump;
});

document.addEventListener("click", function () {
  birdVelocity = jump;
});

// Random Pipe Height
function randomPipeHeight() {
  return Math.floor(Math.random() * (canvas.height / 2)) + 50;
}

// End Game
function endGame() {
  isGameOver = true;
  canvas.style.display = "none";
  document.getElementById("finalScore").textContent = `Final Score: ${score}`;
  document.getElementById("playAgain").style.display = "flex";
}

// Restart Game
document.getElementById("playAgainButton").addEventListener("click", function () {
  document.getElementById("playAgain").style.display = "none";
  canvas.style.display = "block";
  startGame();
});

// Start Game
function startGame() {
  isGameOver = false;
  birdY = canvas.height / 2;
  birdVelocity = 0;
  score = 0;
  pipes.splice(0, pipes.length);
  pipes.push({
    x: canvas.width,
    height: randomPipeHeight(),
  });
  gameLoop();
}
