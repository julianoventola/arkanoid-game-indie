import { Vector } from "../types";

export default class Paddle {
  private paddleImage: HTMLImageElement = new Image();
  private moveLeft: boolean
  private moveRight: boolean

  constructor(
    private speed: number,
    private paddleWidth: number,
    private paddleHeight: number,
    private position: Vector,
    image: string
  ) {
    this.speed = speed
    this.paddleWidth = paddleWidth
    this.paddleHeight = paddleHeight
    this.position = position
    this.moveLeft = false
    this.moveRight = false
    this.paddleImage.src = image
    document.addEventListener("keydown", this.handleKeyDown)
    document.addEventListener("keyup", this.handleKeyUp)
  }

  public get width(): number {
    return this.paddleWidth
  }

  public get height(): number {
    return this.paddleHeight
  }

  public get pos(): Vector {
    return this.position
  }

  public get image(): HTMLImageElement {
    return this.paddleImage
  }

  public get isMovingLeft(): boolean {
    return this.moveLeft
  }

  public get isMovingRight(): boolean {
    return this.moveRight
  }

  movePaddle(): void {
    if (this.moveLeft) this.pos.x -= this.speed
    if (this.moveRight) this.pos.x += this.speed
  }

  handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === "ArrowLeft" || e.key === 'a') {
      this.moveLeft = false
    }
    if (e.key === "ArrowRight" || e.key === 'd') {
      this.moveRight = false
    }
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "ArrowLeft" || e.key === 'a') {
      this.moveLeft = true
    }
    if (e.key === "ArrowRight" || e.key === 'd') {
      this.moveRight = true
    }
  }

  public set padspeed(speed: number) {
    this.speed = speed
  }
}