/// <reference path="../../../typings/index.d.ts" />
import * as _ from 'lodash';

export default class Firefly extends createjs.Container {
  public shape: createjs.Shape;
  public shapeShadow: createjs.Shape;
  public shapeGroup: createjs.Container;
  constructor(public shapeType: number = 0, public shapeWidth: number = 8, public color: string = '#fff') {
    super();
    this.shapeGroup = new createjs.Container();
    this.shape = new createjs.Shape();
    const g = this.shape.graphics;
    g.beginStroke(color);
    switch (shapeType) {
      case 1: // 正方形
        g.drawRect(-shapeWidth / 2, -shapeWidth / 2, shapeWidth, shapeWidth);
        break;
      case 2: // 三角形
        g.moveTo(0, -shapeWidth * 2 / 3)
          .lineTo(-shapeWidth / 2, shapeWidth / 3)
          .lineTo(shapeWidth / 2, shapeWidth / 3)
          .lineTo(0, -shapeWidth * 2 / 3);
        break;
      case 3: // 星形
        g.drawPolyStar(0, 0, shapeWidth / 2, 5, 0.5, 0);
        break;
      default: // 圆形
        g.drawCircle(0, 0, shapeWidth / 2);
    }
    this.shapeShadow = this.shape.clone();
    this.shapeShadow.compositeOperation = 'lighter';
    this.shapeShadow.shadow = new createjs.Shadow(color, 0, 0, 5);
    this.shapeGroup.addChild(this.shapeShadow);
    this.shapeGroup.addChild(this.shape);
    this.addChild(this.shapeGroup);
    this.rotation = Math.random() * 360;
  }
  public animate(ms: number, callback?: () => any) {
    const {x, y, rotation} = this;
    const y1 = y - Math.random() * 5 - 5;
    const rotation1 = rotation + Math.random() * 45 + 30;
    createjs.Tween
      .get(this)
      .wait(Math.random() * ms / 5)
      .to({
        y: y1,
        alpha: 0,
        rotation: rotation1
      }, ms, createjs.Ease.linear)
      .call(() => {
        if (callback) {
          callback();
        }
      });
  }
  public boom(rotation: number = 0, ms: number, distance: number, callback?: () => any) {
    this.rotation = rotation;
    const {x, y} = this.shapeGroup;
    const shapeRotation = this.shapeGroup.rotation;
    const shapeRotation1 = this.shapeGroup.rotation + 3 * 360;
    const x1 = x + distance;
    this.shape.alpha = 0;
    createjs.Tween
      .get(this.shapeGroup)
      .to({
        x: x1,
        alpha: 1,
        rotation: shapeRotation1
      }, ms, createjs.Ease.circOut)
      .to({
        alpha: 0
      }, ms, createjs.Ease.linear)
      .call(() => {
        if (callback) {
          callback();
        }
      });
  }
}
