// import "./styles.css";
let life = 10;

// TODO
/**
 * [ ] 랜덤 블록
 * [ ] 목숨 구하기
 * [ ] 충돌 detect
 * [ ] double jump
 * [ ] jump limit
 */
//

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// 원의 반지름
var ballRadius = 10;
//
var x = ballRadius + 40;
var y = canvas.height - 10;
var dx = 2;
var dy = -2;
let jumping = false;
let jumps = [];

function drawBall() {
  const circle = new Path2D();
  circle.arc(x, y, ballRadius, 0, Math.PI * 2);
  circle.fillStyle = "green";
  ctx.fill(circle);
}

let obstacles = [];
let backgroundWidth = canvas.width;
const count = 4;

function resetObstacles() {
  for (let i = 0; i < count; i++) {
    obstacles.push({
      x: canvas.width + Math.random() * canvas.width * 2,
      y: canvas.height,
      isDetect: false,
    });
  }
}

function removeObstacles() {
  const firstObstacle = obstacles.sort((prev, next) => {
    return prev.x - next.x;
  })[0];

  if (firstObstacle.x < 0) {
    obstacles.shift();
  }
}

function drawBackground() {
  // 배경
  obstacles.forEach((obstacle) => {
    ctx.beginPath();
    ctx.rect(obstacle.x, obstacle.y - 20, 10, 20);

    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  });
}
let speed = 2;
function moveBackground() {
  obstacles.forEach((obstacle) => {
    obstacle.x -= speed;
  });
  backgroundWidth -= speed;
  if (backgroundWidth < 0) {
    backgroundWidth = canvas.width; // reset
    resetObstacles();
  }
}

const DEFAULT_STEPS = 30;
let steps = DEFAULT_STEPS;
function jump(e) {
  if (e.keyCode == 0 || e.keyCode == 32) {
    jumping = true;
  }
}

function doubleJumping(e) {
  if ((e.keyCode == 0 || e.keyCode == 32) && jumps.length < 3) {
    jumps.push(DEFAULT_STEPS);
  }
}

function jumpAction() {
  if (jumping && steps) {
    y += dy;
    steps--;
  } else if (jumping && !steps && y !== canvas.height - 10) {
    y -= dy;
  } else if (jumping && y === canvas.height - 10) {
    jumping = false;
    steps = 30;
  }
}

let leftSteps = 0;
const JUMP_HEIGHT_LIMIT = 100;
function doubleJumpAction() {
  // 남았으면 올라가야지
  if (leftSteps) {
    if (leftSteps && y < canvas.height - JUMP_HEIGHT_LIMIT) {
      y -= dy;
      leftSteps = 0;
    } else {
      y += dy;
      leftSteps--;
    }
  }
  // 다 올라갔고, 아직 바닥이 아니면 내려감
  else if (leftSteps === 0 && y !== canvas.height - 10) {
    y -= dy;
  }
  if (leftSteps === 0 && jumps.length > 0) {
    leftSteps += jumps.shift();
  }
}

document.addEventListener("keydown", doubleJumping, false);

const brickHeight = 20;
const brickWidth = 10;

function detectCollision() {
  obstacles.forEach((obstacle) => {
    if (
      !obstacle.isDetect &&
      x > obstacle.x &&
      x < obstacle.x + brickWidth &&
      y + 10 > obstacle.y - brickHeight
    ) {
      obstacle.isDetect = true;
      life--;
      speed = speed > 5 ? speed : speed + 1;
      refreshLife();
    }
  });
}

function refreshLife() {
  document.querySelector(".life").innerHTML = `LIFE :${life}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBackground();
  // jumpAction(); // 1 jump
  doubleJumpAction();

  moveBackground();
  removeObstacles();
  detectCollision();
}

// draw();
resetObstacles();
setInterval(draw, 23);
