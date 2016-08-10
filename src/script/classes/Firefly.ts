/// <reference path="../../../typings/index.d.ts" />
import * as _ from 'lodash';

export default class Firefly extends createjs.Container {
  public shape: createjs.Shape;
  constructor() {
    super();
    this._initShape();
    const center = new createjs.Shape();
    center.graphics.
      beginFill('red')
      .drawCircle(0, 0, 1);
    this.addChild(center);
  }
  public color(r: number = 255, g: number = 255, b: number = 255) {
    const {shape} = this;
    const colorFilter = new createjs.ColorFilter(0, 0, 0, 1, r, g, b, 0);
    shape.filters = [colorFilter];
    shape.cache(-20, -20, 40, 40);
  }
  private _initShape() {
    const shape = new createjs.Shape();
    shape.graphics
      .beginRadialGradientFill(['rgba(255, 255, 255, 255)', 'rgba(255, 255, 255, 0)'], [0, 1], 0, 0, 1, 0, 0, 20)
      .drawCircle(0, 0, 20);
    this.addChild(shape);
    this.shape = shape;
  }
}
