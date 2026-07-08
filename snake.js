import { DIRECTIONS, GRID_SIZE, createInitialState, queueDirection, spawnFood, stepGame } from "./gameCore.js";

const TICK_MS = 125;
const canvas = document.querySelector("#board");
const context = canvas.getContext("2d");
const score = document.querySelector("#score");
const status = document.querySelector("#status");
const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");
const controls = document.querySelectorAll("[data-direction]");
const cellSize = canvas.width / GRID_SIZE;

let state = createInitialState();
let timerId = null;

function drawCell(cell, fillStyle) {
  context.fillStyle = fillStyle;
  context.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
}

function render() {
  context.fillStyle = "#dfe7e2";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#c4d0ca";
  context.lineWidth = 1;
  for (let index = 0; index <= GRID_SIZE; index += 1) {
    const position = index * cellSize;
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, canvas.height);
    context.moveTo(0, position);
    context.lineTo(canvas.width, position);
    context.stroke();
  }

  if (state.food) {
    drawCell(state.food, "#b23b3b");
  }
  state.snake.forEach((segment, index) => drawCell(segment, index === 0 ? "#1f5135" : "#35724e"));
  score.textContent = String(state.score);

  if (state.isGameOver) {
    status.textContent = `Game over. Score ${state.score}. Press Restart.`;
  } else if (!state.isStarted) {
    status.textContent = "Press Start or any direction key.";
  } else {
    status.textContent = "";
  }
}

function startLoop() {
  if (timerId) {
    return;
  }

  timerId = window.setInterval(() => {
    state = stepGame(state);
    render();
    if (state.isGameOver) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }, TICK_MS);
}

function startGame() {
  if (state.isGameOver) {
    return;
  }
  state = { ...state, isStarted: true };
  render();
  startLoop();
}

function restartGame() {
  window.clearInterval(timerId);
  timerId = null;
  state = createInitialState(spawnFood(createInitialState().snake));
  render();
}

function setDirection(directionName) {
  const nextDirection = DIRECTIONS[directionName];
  if (!nextDirection) {
    return;
  }
  state = queueDirection(state, nextDirection);
  render();
  startLoop();
}

const keyDirections = new Map([
  ["ArrowUp", "up"],
  ["w", "up"],
  ["W", "up"],
  ["ArrowDown", "down"],
  ["s", "down"],
  ["S", "down"],
  ["ArrowLeft", "left"],
  ["a", "left"],
  ["A", "left"],
  ["ArrowRight", "right"],
  ["d", "right"],
  ["D", "right"],
]);

window.addEventListener("keydown", (event) => {
  const directionName = keyDirections.get(event.key);
  if (!directionName) {
    return;
  }
  event.preventDefault();
  setDirection(directionName);
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
controls.forEach((button) => {
  button.addEventListener("click", () => setDirection(button.dataset.direction));
});

render();
