/// <reference path="../../typings/index.d.ts" />

const stage = new createjs.Stage('canvas');
const shape = new createjs.Shape();
shape.graphics
  .beginFill('#555')
  .drawRect(0, 0, 30, 30);
shape.x = shape.y = 30;
stage.addChild(shape);
stage.update();
