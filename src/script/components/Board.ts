/// <reference path="../../../typings/index.d.ts" />

export default class Board {
  shape: createjs.Shape;
  constructor(public blockWidth: number = 30, public colCount: number = 10, public rowCount: number = 20) {
    this.shape = new createjs.Shape();
    this.shape.graphics
      .beginFill('rgba(0, 0, 0, 0.5)')
      .drawRect(0, 0, this.getWidth(), this.getHeight());
  }

  getWidth(): number {
    return this.blockWidth * this.colCount;
  }

  getHeight(): number {
    return this.blockWidth * this.rowCount;
  }

  get x(): number {
    return this.shape.x;
  }
  set x(x: number) {
    this.shape.x = x;
  }

  get y(): number {
    return this.shape.y;
  }
  set y(y: number) {
    this.shape.y = y;
  }
}
