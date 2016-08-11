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
  }
  public animate(ms: number, callback?: () => void) {
    this.randomScale();
    this.color(255, 255, 0);
    const {x, y} = this.shape;
    const y1 = y - Math.random() * 4 - 4;
    const t = Math.random() * 100 + ms - 50;
    createjs.Tween
      .get(this.shape)
      .to({
        y: y1,
        alpha: 0
      }, t, createjs.Ease.linear)
      .call(() => {
        if (callback) {
          callback();
        }
      });
  }
  public color(r: number = 255, g: number = 255, b: number = 255) {
    const {shape} = this;
    const colorFilter = new createjs.ColorFilter(0, 0, 0, 1, r, g, b, 0);
    shape.filters = [colorFilter];
    shape.cache(-5, -5, 10, 10);
  }
  public randomScale() {
    this.shape.scaleX = this.shape.scaleY = Math.random() * 0.5 + 0.5;
  }
  private _initShape() {
    const shape = new createjs.Shape();
    shape.graphics
      .beginRadialGradientFill(['rgba(255, 255, 255, 255)', 'rgba(255, 255, 255, 0)'], [0, 1], 0, 0, 1, 0, 0, 5)
      .drawCircle(0, 0, 5);
    shape.alpha = 0.75;
    this.addChild(shape);
    this.shape = shape;
  }
}
