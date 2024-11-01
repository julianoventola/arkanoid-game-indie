import { Vector } from "../types";

export default class Ball {
  private speed: Vector
  private ballImage: HTMLImageElement = new Image();

  constructor(
    speed: number,
    private ballSize: number,
    private position: Vector,
    image: string
  ) {
    this.ballSize = ballSize
    this.position = position
    this.speed = {
      x: speed,
      y: -speed
    }
    this.ballImage.src = image
  }

  public get width(): number {
    return this.ballSize
  }

  public get height(): number {
    return this.ballSize
  }

  public get pos(): Vector {
    return this.position
  }

  public get image(): HTMLImageElement {
    return this.ballImage
  }

  changeYDirection(): void {
    this.speed.y = -this.speed.y
  }

  changeXDirection(): void {
    this.speed.x = -this.speed.x
  }

  moveBall(): void {
    this.pos.x += this.speed.x
    this.pos.y += this.speed.y
  }
}