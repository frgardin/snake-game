# Classic Snake

A small dependency-free Snake game built with HTML, CSS, and JavaScript modules.

## Live demo

Play it at https://frgardin.github.io/snake-game/.

## Run locally

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Test core logic

```bash
npm test
```

The tests cover movement, growth, wall/self collisions, blocked reversals, and food placement.

## Manual checks

- Start with the Start button or any arrow/WASD key.
- Move with arrow keys or WASD.
- Use the on-screen controls on mobile or narrow screens.
- Eat food and confirm the score increments.
- Hit a wall or the snake body and confirm game over.
- Restart and confirm the score and snake reset.
