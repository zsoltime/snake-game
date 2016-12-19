'use strict';

let snake;
let fruit;
let cellSize = 20;
let gridSize = {
  rows: 30,
  cols: 40
};
let colors = {
  background: '#e6ee9c',
  fruit: '#ff5252',
  snake: '#689f38'
}
let game = document.getElementById('game');
let score = 0;

function setup() {
  let canvas = createCanvas(gridSize.cols * cellSize, gridSize.rows * cellSize);
  canvas.parent('game');

  noStroke();
  ellipseMode(CORNER);

  snake = Snake();
  fruit = Fruit();

  text('Score: 0', height - 200, width - 100);
  fill(51);
  frameRate(8);
}

function draw() {
  background(colors.background);
  // translate(cellSize / 2, cellSize / 2);

  snake.checkCollision();
  snake.update();
  snake.show();

  if (snake.eat(fruit)) {
    fruit = Fruit();
  }
  textSize(cellSize * .65);
  fill(51);
  text(`Score: ${score}`, width - cellSize * 4, height - cellSize);
  fruit.show();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.move('up');
  }
  else if(keyCode === RIGHT_ARROW) {
    snake.move('right');
  }
  else if(keyCode === DOWN_ARROW) {
    snake.move('down');
  }
  else if(keyCode === LEFT_ARROW) {
    snake.move('left');
  }
}

function Snake() {
  let x = width / 2;
  let y = height;
  let moveX = 0;
  let moveY = -1;
  let total = 0;
  let tail = [];

  function update() {
    if (total === tail.length) {
      for (let i = 0; i < tail.length - 1; i++) {
        tail[i] = tail[i + 1];
      }
    }
    tail[total - 1] = createVector(x, y);

    x = x + moveX * cellSize;
    y = y + moveY * cellSize;

    x = constrain(x, 0, width - cellSize);
    y = constrain(y, 0, height - cellSize);
  }

  function show() {
    fill(colors.snake);
    // tail
    for (let i = 0; i < total; i++) {
      rect(tail[i].x + cellSize * 0.01, tail[i].y + cellSize * 0.01, cellSize * .98, cellSize * .98);
    }
    // head
    rect(x, y, cellSize, cellSize);
  }

  function changeDirection(to) {
    if (to === 'up') {
      moveX = 0;
      moveY = -1;
    }
    else if(to === 'right') {
      moveX = 1;
      moveY = 0;
    }
    else if(to === 'down') {
      moveX = 0;
      moveY = 1;
    }
    else if(to === 'left') {
      moveX = -1;
      moveY = 0;
    }
  }

  function eat(fruit) {
    let d = dist(x, y, fruit.x, fruit.y);
    if (d < 1) {
      total += 1;
      score += 1;
      return true;
    }
  }

  function checkCollision() {
    for (let i = 0; i < tail.length; i++) {
      let d = dist(x, y, tail[i].x, tail[i].y);
      if (d < 1) {
        total = 0;
        score = 0;
        tail = [];
      }
    }
  }

  return {
    update: update,
    show: show,
    move: changeDirection,
    eat: eat,
    checkCollision: checkCollision
  }
}

function Fruit() {
  let x = Math.floor(random(gridSize.cols)) * cellSize;
  let y = Math.floor(random(gridSize.rows)) * cellSize;

  function show() {
    fill(colors.fruit);
    ellipse(x, y, cellSize);
  }

  return {
    x: x,
    y: y,
    show: show
  }
}
