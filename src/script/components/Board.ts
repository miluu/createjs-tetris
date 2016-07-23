/// <reference path="../../../typings/index.d.ts" />

export default class Board extends createjs.Shape {
  constructor(
    public cellWidth: number = 30,
    public colsCount: number = 10,
    public rowsCount: number = 20
  ) {
    super();
    this.init();
  }

  init(): void {
    this.graphics
      .beginFill('rgba(0, 0, 0, 0.5)')
      .drawRect(0, 0, this.getWidth(), this.getHeight());
  }

  getWidth(): number {
    return this.cellWidth * this.colsCount;
  }

  getHeight(): number {
    return this.cellWidth * this.rowsCount;
  }
}
