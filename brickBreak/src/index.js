// import "./styles.css";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

// 원의 반지름
var ballRadius = 10;
function drawBall() {
  // 원

  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  collisionDetection();
}
// paddle
function drawPaddle() {
  ctx.beginPath();

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

////////

var paddleHeight = 10; //높이
var paddleWidth = 75; // 넓이
var paddleX = (canvas.width - paddleWidth) / 2; // x축 위에 시작지점

/// 이벤트 핸들링

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// 벽돌
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

// 변수 초기화
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: true };
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 충돌 감지
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (
        b.status &&
        x > b.x &&
        x < b.x + brickWidth &&
        y > b.y &&
        y < b.y + brickHeight
      ) {
        dy = -dy;
        b.status = false;
      } else {
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
          dx = -dx;
        }
        if (y + dy < ballRadius) {
          dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
          if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy; // 패들이랑 부딛히면 튕기기
          } else {
            // alert("GAME OVER");
          }
        }
      }
    }
  }
}

// DRAW

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  x += dx;
  y += dy;

  drawBricks();
  drawPaddle();
}

// draw();
setInterval(draw, 13);
