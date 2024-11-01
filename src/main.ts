import CanvasView from './view/CanvasView';

import Brick from "./sprites/Brick";
import Paddle from "./sprites/Paddle";
import Ball from "./sprites/Ball";

import PADDLE_IMAGE from "./images/paddle.png";
import BALL_IMAGE from "./images/ball.png";

import {
  PADDLE_SPEED,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_STARTX,
  BALL_SPEED,
  BALL_SIZE,
  BALL_STARTX,
  BALL_STARTY
} from "./setup";

import { createBricks } from "./helpers";

import "./style/index.css";

let gameOver = false
let score = 0

function setGameOver(view: CanvasView) {
  view.drawInfo("Game Over!")
  gameOver = false
}

function setGameWin(view: CanvasView) {
  view.drawInfo("You win!")
  gameOver = false
}

function gameLoop(
  view: CanvasView,
  bricks: Brick[],
  paddle: Paddle,
  // ball: Ball
) {
  view.clear()
  view.drawBrick(bricks)
  view.drawSprite(paddle)

  if (
    (paddle.isMovingLeft && paddle.pos.x > 0) ||
    (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
  ) {
    paddle.movePaddle()
  }


  requestAnimationFrame(() => gameLoop(view, bricks, paddle))
}

function startGame(view: CanvasView,) {
  score = 0;
  view.drawInfo('')
  view.drawScore(0)
  const bricks = createBricks()

  const paddle = new Paddle(
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    { x: PADDLE_STARTX, y: view.canvas.height - PADDLE_HEIGHT - 5 },
    PADDLE_IMAGE
  )

  gameLoop(view, bricks, paddle)
}

const view = new CanvasView("#playField")
view.initStartButton(startGame)