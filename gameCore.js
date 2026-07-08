export const GRID_SIZE = 21;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function createInitialState(food = { x: 14, y: 10 }) {
  return {
    snake: INITIAL_SNAKE.map((cell) => ({ ...cell })),
    direction: DIRECTIONS.right,
    pendingDirection: DIRECTIONS.right,
    food,
    score: 0,
    isGameOver: false,
    isStarted: false,
  };
}

export function areSameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function isOppositeDirection(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

export function queueDirection(state, nextDirection) {
  if (state.isGameOver || isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
    isStarted: true,
  };
}

export function getFreeCells(snake, gridSize = GRID_SIZE) {
  const freeCells = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (!snake.some((segment) => segment.x === x && segment.y === y)) {
        freeCells.push({ x, y });
      }
    }
  }
  return freeCells;
}

export function spawnFood(snake, gridSize = GRID_SIZE, random = Math.random) {
  const freeCells = getFreeCells(snake, gridSize);
  if (freeCells.length === 0) {
    return null;
  }
  return freeCells[Math.floor(random() * freeCells.length)];
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver || !state.isStarted) {
    return state;
  }

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
  const ateFood = Boolean(state.food && areSameCell(nextHead, state.food));
  const nextSnake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)];

  const hitWall =
    nextHead.x < 0 ||
    nextHead.x >= GRID_SIZE ||
    nextHead.y < 0 ||
    nextHead.y >= GRID_SIZE;
  const hitSelf = nextSnake.slice(1).some((segment) => areSameCell(segment, nextHead));

  if (hitWall || hitSelf) {
    return {
      ...state,
      direction,
      snake: nextSnake,
      isGameOver: true,
    };
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: ateFood ? spawnFood(nextSnake, GRID_SIZE, random) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}
