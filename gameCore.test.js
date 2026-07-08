import assert from "node:assert/strict";
import test from "node:test";
import { DIRECTIONS, createInitialState, queueDirection, spawnFood, stepGame } from "./gameCore.js";

test("moves the snake in the current direction", () => {
  const state = { ...createInitialState(), isStarted: true };
  const next = stepGame(state);

  assert.deepEqual(next.snake[0], { x: 11, y: 10 });
  assert.equal(next.snake.length, 3);
  assert.equal(next.score, 0);
});

test("grows and scores when food is eaten", () => {
  const state = { ...createInitialState({ x: 11, y: 10 }), isStarted: true };
  const next = stepGame(state, () => 0);

  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.ok(next.food);
  assert.notDeepEqual(next.food, { x: 11, y: 10 });
});

test("detects wall collisions", () => {
  const state = {
    ...createInitialState(),
    snake: [{ x: 20, y: 10 }],
    isStarted: true,
  };
  const next = stepGame(state);

  assert.equal(next.isGameOver, true);
});

test("detects self collisions", () => {
  const state = {
    ...createInitialState(),
    snake: [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 11, y: 11 },
      { x: 10, y: 11 },
    ],
    direction: DIRECTIONS.up,
    pendingDirection: DIRECTIONS.right,
    isStarted: true,
  };
  const next = stepGame(state);

  assert.equal(next.isGameOver, true);
});

test("does not allow direct reversal", () => {
  const state = createInitialState();
  const next = queueDirection(state, DIRECTIONS.left);

  assert.deepEqual(next.pendingDirection, DIRECTIONS.right);
});

test("spawns food only on free cells", () => {
  const food = spawnFood(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    2,
    () => 0,
  );

  assert.deepEqual(food, { x: 1, y: 1 });
});
