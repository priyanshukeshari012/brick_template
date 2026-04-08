const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;
const ballRadius = 10;

const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let level = 1;
let bricksRemaining = brickRowCount * brickColumnCount;
const maxRows = 6;
const maxCols = 8;

const bricks = [];

function initBricks(rows, cols) {
  // reset bricks array
  bricks.length = 0;
  for (let c = 0; c < cols; c++) {
    bricks[c] = [];
    for (let r = 0; r < rows; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  bricksRemaining = rows * cols;
}

// initialize for the first time
initBricks(brickRowCount, brickColumnCount);

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00f";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0f0";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#f00";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          ballDY = -ballDY;
          b.status = 0;
          score++;
          bricksRemaining--;
          // level complete
          if (bricksRemaining === 0) {
            advanceLevel();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 8, 20);
  ctx.fillText("Level: " + level, 8, 40);
}

function advanceLevel() {
  level++;

  // Increase difficulty: add a row or a column (prefer column first), cap at max
  if (brickColumnCount < maxCols) {
    brickColumnCount++;
  } else if (brickRowCount < maxRows) {
    brickRowCount++;
  }

  // Slightly increase ball speed
  ballDX *= 1.15;
  ballDY *= 1.15;

  // Slightly shrink paddle, but not too small
  paddleWidth = Math.max(50, paddleWidth - 5);

  // Recalculate paddle position so it stays within bounds
  paddleX = Math.min(paddleX, canvas.width - paddleWidth);

  // Rebuild bricks for the next level
  initBricks(brickRowCount, brickColumnCount);

  // Reset ball to center and pause briefly
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballDX = Math.sign(ballDX) * Math.abs(ballDX);
  ballDY = -Math.abs(ballDY);

  // Quick notice to player
  setTimeout(() => {
    alert("Level " + level + " — Good luck!");
  }, 100);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  if (
    ballX + ballDX > canvas.width - ballRadius ||
    ballX + ballDX < ballRadius
  ) {
    ballDX = -ballDX;
  }
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > canvas.height - ballRadius) {
    if (
      ballX > paddleX &&
      ballX < paddleX + paddleWidth
    ) {
      ballDY = -ballDY;
    } else {
      alert("GAME OVER");
      document.location.reload();
    }
  }

  ballX += ballDX;
  ballY += ballDY;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

draw();