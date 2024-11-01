var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class CanvasView {
  constructor(canvasName) {
    __publicField(this, "canvas");
    __publicField(this, "context");
    __publicField(this, "scoreDisplay");
    __publicField(this, "start");
    __publicField(this, "info");
    this.canvas = document.querySelector(canvasName);
    this.context = this.canvas.getContext("2d");
    this.scoreDisplay = document.querySelector("#score");
    this.start = document.querySelector("#start");
    this.info = document.querySelector("#info");
  }
  clear() {
    var _a;
    (_a = this.context) == null ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  initStartButton(startFunction) {
    var _a;
    (_a = this.start) == null ? void 0 : _a.addEventListener("click", () => startFunction(this));
  }
  drawScore(score2) {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = "Score: " + score2.toString();
    }
  }
  drawInfo(text) {
    if (this.info) {
      this.info.textContent = text;
    }
  }
  drawSprite(brick) {
    var _a;
    if (!brick) return;
    (_a = this.context) == null ? void 0 : _a.drawImage(
      brick.image,
      brick.pos.x,
      brick.pos.y,
      brick.width,
      brick.height
    );
  }
  drawBrick(bricks) {
    bricks.forEach((brick) => this.drawSprite(brick));
  }
}
class Collision {
  isCollidingBrick(ball, brick) {
    if (ball.pos.x < brick.pos.x + brick.width && ball.pos.x + ball.width > brick.pos.x && ball.pos.y < brick.pos.y + brick.height && ball.pos.y + ball.height > brick.pos.y) {
      return true;
    }
    return false;
  }
  isCollidingBricks(ball, bricks) {
    let colliding = false;
    for (const brick of bricks) {
      if (this.isCollidingBrick(ball, brick)) {
        ball.changeYDirection();
        if (brick.energy === 1) {
          bricks.splice(bricks.indexOf(brick), 1);
        } else {
          brick.energy -= 1;
        }
        colliding = true;
      }
    }
    return colliding;
  }
  checkBallCollision(ball, paddle, view2) {
    if (ball.pos.x + ball.width > paddle.pos.x && ball.pos.x < paddle.pos.x + paddle.width && ball.pos.y + ball.height === paddle.pos.y) {
      ball.changeYDirection();
    }
    if (ball.pos.x > view2.canvas.width - ball.width || ball.pos.x < 0) {
      ball.changeXDirection();
    }
    if (ball.pos.y < 0) {
      ball.changeYDirection();
    }
  }
}
class Paddle {
  constructor(speed, paddleWidth, paddleHeight, position, image) {
    __publicField(this, "paddleImage", new Image());
    __publicField(this, "moveLeft");
    __publicField(this, "moveRight");
    __publicField(this, "handleKeyUp", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        this.moveLeft = false;
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        this.moveRight = false;
      }
    });
    __publicField(this, "handleKeyDown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        this.moveLeft = true;
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        this.moveRight = true;
      }
    });
    this.speed = speed;
    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeight;
    this.position = position;
    this.speed = speed;
    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeight;
    this.position = position;
    this.moveLeft = false;
    this.moveRight = false;
    this.paddleImage.src = image;
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  get width() {
    return this.paddleWidth;
  }
  get height() {
    return this.paddleHeight;
  }
  get pos() {
    return this.position;
  }
  get image() {
    return this.paddleImage;
  }
  get isMovingLeft() {
    return this.moveLeft;
  }
  get isMovingRight() {
    return this.moveRight;
  }
  movePaddle() {
    if (this.moveLeft) this.pos.x -= this.speed;
    if (this.moveRight) this.pos.x += this.speed;
  }
  set padspeed(speed) {
    this.speed = speed;
  }
}
class Ball {
  constructor(speed, ballSize, position, image) {
    __publicField(this, "speed");
    __publicField(this, "ballImage", new Image());
    this.ballSize = ballSize;
    this.position = position;
    this.ballSize = ballSize;
    this.position = position;
    this.speed = {
      x: speed,
      y: -speed
    };
    this.ballImage.src = image;
  }
  get width() {
    return this.ballSize;
  }
  get height() {
    return this.ballSize;
  }
  get pos() {
    return this.position;
  }
  get image() {
    return this.ballImage;
  }
  changeYDirection() {
    this.speed.y = -this.speed.y;
  }
  changeXDirection() {
    this.speed.x = -this.speed.x;
  }
  moveBall() {
    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
  }
}
const PADDLE_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAACICAYAAAAf1492AAAAAXNSR0IArs4c6QAAA9FJREFUeJzt3TFunEAYgFGIKLwnSJccLufK5dLlBLjbFOlWdrwR7Ddmea9xN/wej4Q+g8Q8bXfdYQ0O6uXqzw8AZ/M6z6NHYKxNB+DLXlMAAAB8RIAAAAAZAQIAAGQECAAAkBEgAABARoAAAAAZAQIAAGQECAAAkBEgAABARoAAAAAZAQIAAGQECAAAkBEgAABARoAAAACZZZqm65YFfn/7sdMoHNH30QMAAHAoy+gBAAA4Fv+APrevv35ueoDhFSwAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMr4Dwqe2jh4AAA7oMnoA+AdPQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADILKMHACB0GT3AO9bRA7A/hw14mwCBgdyeAYCz8QoWAACQESAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZAQIAACQWUYPAMAHLjuutcbXG3HNe67HOxy2/a8H3BIg8J/cnve/HgBwHl7BAgAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMsvoAQCe2mXHtdYd1/ps9vjdLjc/tzjkXjts93HYYDQBwqm4Pd/H7RkAeBSvYAEAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAAJll9AAAT20dPcCJnH6vT78BIXsNWwgQTsUto2OvAYC3eAULAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADICBAAACAjQAAAgIwAAQAAMgIEAADIzNM0XUcPwXG9XB97fNaHrn4Ml53Xs6d8yKEj47A9yt47e+t1nh98BZ6ZJyAAAEBGgAAAABkBAgAAZAQIAACQESAAAEBGgAAAABkBAgAAZJbp77dAtvAdEQAA4C7L6AEAAIBD2fQAwytYAABARoAAAAAZAQIAAGQECAAAkBEgAABARoAAAACZP7d3MHqc10UvAAAAAElFTkSuQmCC";
const BALL_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAATdJREFUOI1jZCAAEmq7/2MTX9BcyohPHwshAwMcrXCogMjjsgBDkLCBqGDD/mMM2CxA4STUdv8n1kBsFiAbDmeQaqiBkjQDAwMDw4V7T7EazkSO62CGorORARMDA8S1Xz6+J9lQdLEARyt4HJHlYmIAs7m7//9fP74zcHBxM+hpqBHU8OL9ZwYJQT4UMeRw1lCUZeCQ02wgy8XIBiGzkQGKwUs2bCXJcFyGYhhMTYBhMCmuJsrgj29eUcVAuMEnd25k/PT2NYogJa6G5T6UoEB2NTmGI+uBlxXm7v7/+YRFGRgYGBj4RcRQNMQEeBNlKA+/ILyswFoef3zzCsVwclyPUmwiu5qBAdPl+ACyazEMhhnOwMDAQKwFPPyCDAwMBAp6QhYgA2lldawGEjQY3QJ0cHLnRrx6AaQ2d5KPn0TMAAAAAElFTkSuQmCC";
const RED_BRICK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAl8AAADpCAYAAAAas1JcAAAAAXNSR0IArs4c6QAABLZJREFUeJzt2DFOAlEYRlEhswBKVsESLC0tbY29pY2rIbaWlpQsgUUQVgHuwGKG3AlyTv9evvLmXzxMdPx4v0z9A4DrW+72c0+Af2t9OCzGvl1ecwgAAH8TXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABAajh/vlykffH3/XGsLAMBNOG02o/vJ5QsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAIDTMPeBttZp7AgBwZ85Pj9M+2O1HP3X5AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgNCw3O3n3gAAcDdcvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACA0zD0AAODWbA/r0W9dvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACA0TP3g9eV50vvz1AEAADfE5QsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAILSY+sFps7lcYwj3Z3tYzz0BAEb5fNiNbiiXLwCAkPgCAAiJLwCAkPgCAAiJLwCAkPgCAAiJLwCAkPgCAAiJLwCAkPgCAAiJLwCAkPgCAAiJLwCAkPgCAAiJLwCA0C8E8Bxnw4akbgAAAABJRU5ErkJggg==";
const BLUE_BRICK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAl8AAADpCAYAAAAas1JcAAAAAXNSR0IArs4c6QAABLtJREFUeJzt2LFJQ2EYhlETs0DABaxt7FzAEXQOB7C2sHQMiTiEnQOkthdBi/RxA4V7L89Fc07//bzlw784Gun4cbcf+wYA01tvtnNPgH/r4+liMfR2OeUQAAB+Jr4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgtDh+3O3HPHB6+zDVFgCAP+Hr/HLwrZ8vAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAIDQau4BX+eXc08AAA7M5/XZqPv1Zjv41s8XAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhFbrzXbuDQAAB8PPFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAIRWcw8AAPhrli/3w28n3AEAwC/EFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBAaDX2gbe7myl2AAAcBD9fAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAChxdgHTq5e91MM4fAsX+7nngAAg7y/Pw9uKD9fAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAChbx37HB2a9XeSAAAAAElFTkSuQmCC";
const GREEN_BRICK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAl8AAADpCAYAAAAas1JcAAAAAXNSR0IArs4c6QAABLRJREFUeJzt2LFNw1AYRlGCIliAASgCjRmCZZiKGRAtJUvQAKKmSEeVFIQNKGzrWpBz+vf0lVf/6mSi4XE4TP0DgPntt7ulJ8C/9Xb3vhr79nTOIQAA/E58AQCExBcAQEh8AQCExBcAQEh8AQCExBcAQEh8AQCExBcAQEh8AQCExBcAQEh8AQCExBcAQEh8AQCExBcAQGg1PA6HKR+8Pr/MtQUA4E+4vNmMfuvyBQAQEl8AACHxBQAQEl8AACHxBQAQEl8AACHxBQAQEl8AACHxBQAQEl8AACHxBQAQEl8AACHxBQAQEl8AACHxBQAQWi894PJms/QEAODInF2cT3q/3+5Gv3X5AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgNB6v90tvQEA4Gi4fAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBIfAEAhMQXAEBovfQAAIC/5vPpY/Rbly8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIrad+cH07zLEDAOAouHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAIRWUz+4ut8c5hjC8fl8+lh6AgCM8vXwPbqhXL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAEI/N7ceGcLiMVoAAAAASUVORK5CYII=";
const YELLOW_BRICK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAl8AAADpCAYAAAAas1JcAAAAAXNSR0IArs4c6QAABLtJREFUeJzt2DFuE0EAhlFsVjQ0rrgATUpLEVfgDL4Op/EduAKiT+PGXVyktpDw5gaR2F19q+D3+pn5y0+z+TDT+HIY594BwPJul9PaE+C/9fHh12bq2e2SQwAAeJv4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgNBmfDmMcy748/P3UlsAAN6FYb+bfNbPFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBAaFh9wH639gQA4M5sv3yddf52OU1/e9bLAAD8E/EFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABAabpfT2hsAAO6Gny8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIDWsPAAB4b67H8+Szfr4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgJL4AAELiCwAgNMy94NP3xyV2AADcBT9fAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAAh8QUAEBJfAAChzdwL/j59G5cYwv25Hs9rTwCAST7/eJ7cUH6+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABCr61BHuo6DHN6AAAAAElFTkSuQmCC";
const PURPLE_BRICK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAl8AAADpCAYAAAAas1JcAAAAAXNSR0IArs4c6QAABLlJREFUeJzt2KFNQ2EYhlFKSoIGR4ICgWQLNmAEBmAQJEPACgyBRLSqAdnUIcsGiHtvnhvoOf7/88on3+JopNe7t/3YPwCY3ma9nXsC/FuPq/vF0LfHUw4BAOB34gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABC4gsAICS+AABCi9e7t/2YD94/vqbaAgDwJ5yfnA5+6/IFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABBazj3g/OR07gkAwIG5vDob9X6z3g5+6/IFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAIfEFABASXwAAoeVmvZ17AwDAwXD5AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgJD4AgAIiS8AgNBy7gEAAH/N6ns3+K3LFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAITEFwBASHwBAISWYz+4vbmYYgcAwEFw+QIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACIkvAICQ+AIACC3GfvB0/bKfYgiHZ/W9m3sCAAzy/PkwuKFcvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQuILACAkvgAAQj9jNh42a0utjgAAAABJRU5ErkJggg==";
const canvas = document.querySelector("#playField");
const STAGE_PADDING = 10;
const STAGE_ROWS = 20;
const STAGE_COLS = 10;
const BRICK_PADDING = 5;
const BRICK_WIDTH = canvas ? Math.floor((canvas.width - STAGE_PADDING * 2) / STAGE_COLS) - BRICK_PADDING : 100;
const BRICK_HEIGHT = canvas ? Math.floor((canvas.height - STAGE_PADDING * 2) / STAGE_ROWS) - BRICK_PADDING : 30;
const PADDLE_WIDTH = 150;
const PADDLE_HEIGHT = 25;
const PADDLE_STARTX = 450;
const PADDLE_SPEED = 10;
const BALL_SPEED = 3;
const BALL_SIZE = 20;
const BALL_STARTX = 500;
const BALL_STARTY = 400;
const BRICK_IMAGES = {
  1: RED_BRICK_IMAGE,
  2: GREEN_BRICK_IMAGE,
  3: YELLOW_BRICK_IMAGE,
  4: BLUE_BRICK_IMAGE,
  5: PURPLE_BRICK_IMAGE
};
const BRICK_ENERGY = {
  1: 1,
  // Red brick
  2: 1,
  // Green brick
  3: 2,
  // Yellow brick
  4: 2,
  // Blue brick
  5: 3
  // Purple brick
};
const LEVEL = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  0,
  0,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  0,
  0,
  0,
  4,
  4,
  4,
  4,
  4,
  4,
  0,
  0,
  0,
  0,
  5,
  5,
  0,
  0,
  5,
  5,
  0,
  0
];
class Brick {
  constructor(brickWidth, brickHeight, position, brickEnergy, image) {
    __publicField(this, "brickImage", new Image());
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.position = position;
    this.brickEnergy = brickEnergy;
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.position = position;
    this.brickEnergy = brickEnergy;
    this.brickImage.src = image;
  }
  get width() {
    return this.brickWidth;
  }
  get height() {
    return this.brickHeight;
  }
  get pos() {
    return this.position;
  }
  get image() {
    return this.brickImage;
  }
  get energy() {
    return this.brickEnergy;
  }
  set energy(energy) {
    this.brickEnergy = energy;
  }
}
function createBricks() {
  return LEVEL.reduce((acc, item, index) => {
    const row = Math.floor((index + 1) / STAGE_COLS);
    const col = index % STAGE_COLS;
    const x = STAGE_PADDING + col * (BRICK_WIDTH + BRICK_PADDING);
    const y = STAGE_PADDING + row * (BRICK_HEIGHT + BRICK_PADDING);
    if (item === 0) return acc;
    return [
      ...acc,
      new Brick(
        BRICK_WIDTH,
        BRICK_HEIGHT,
        { x, y },
        BRICK_ENERGY[item],
        BRICK_IMAGES[item]
      )
    ];
  }, []);
}
let gameOver = false;
let score = 0;
function setGameOver(view2) {
  view2.drawInfo("Game Over!");
  gameOver = false;
}
function setGameWin(view2) {
  view2.drawInfo("You win!");
  gameOver = false;
}
function gameLoop(view2, bricks, paddle, ball, collision) {
  view2.clear();
  view2.drawBrick(bricks);
  view2.drawSprite(paddle);
  view2.drawSprite(ball);
  ball.moveBall();
  if (paddle.isMovingLeft && paddle.pos.x > 0 || paddle.isMovingRight && paddle.pos.x < view2.canvas.width - paddle.width) {
    paddle.movePaddle();
  }
  collision.checkBallCollision(ball, paddle, view2);
  const isCollidingBrick = collision.isCollidingBricks(ball, bricks);
  if (isCollidingBrick) {
    score += 1;
    view2.drawScore(score);
  }
  if (ball.pos.y > view2.canvas.height) {
    gameOver = true;
  }
  if (bricks.length === 0) {
    return setGameWin(view2);
  }
  if (gameOver) {
    return setGameOver(view2);
  }
  requestAnimationFrame(() => gameLoop(view2, bricks, paddle, ball, collision));
}
function startGame(view2) {
  score = 0;
  view2.drawInfo("");
  view2.drawScore(0);
  const collision = new Collision();
  const bricks = createBricks();
  const ball = new Ball(
    BALL_SPEED,
    BALL_SIZE,
    { x: BALL_STARTX, y: BALL_STARTY },
    BALL_IMAGE
  );
  const paddle = new Paddle(
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    { x: PADDLE_STARTX, y: view2.canvas.height - PADDLE_HEIGHT - 5 },
    PADDLE_IMAGE
  );
  gameLoop(view2, bricks, paddle, ball, collision);
}
const view = new CanvasView("#playField");
view.initStartButton(startGame);
