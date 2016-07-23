/// <reference path="../../../typings/index.d.ts" />

export default class Cell extends createjs.Shape {
  constructor(public cellWidth: number) {
    super();
    this.init();
  }

  init(): void {
    const shapeWidth = this.cellWidth - 4
    this.graphics
      .beginFill('#000')
      .drawRect(2, 2, shapeWidth, shapeWidth);
  }
}
