/// <reference path="../../../typings/index.d.ts" />
import * as _ from 'lodash';

export default class Star extends createjs.Container {
  public star: createjs.Container;
  public lines: createjs.Container[];
  constructor() {
    super();
    this._initStar();
    this._initLines();
    const center = new createjs.Shape();
    this.addChild(center);
  }

  public gone(ms: number) {
    createjs.Tween.get(this.star)
      .to({
        alpha: 0,
      }, ms, createjs.Ease.circOut);
    this.boom(ms, 20, true);
  }

  public spin(ms: number, degree: number = 360, reset: boolean = false, callback?: () => any) {
    createjs.Tween
      .get(this.star)
      .to({rotation: degree}, ms, createjs.Ease.sineOut)
      .call(() => {
        if (reset) {
          this.rotation = 0;
        }
        if (callback) {
          callback();
        }
      });
  }

  public boom(ms: number, distance: number, reset: boolean = false, callback?: () => any) {
    _.forEach(this.lines, (line) => {
      createjs.Tween.get(line)
        .to({
          alpha: 1
        }, ms)
        .call(() => {
          if (reset) {
            line.children[0].x = 0;
            line.alpha = 0;
          }
          if (callback) {
            callback();
          }
        });
      createjs.Tween.get(line.children[0])
        .to({
          x: distance
        }, ms, createjs.Ease.cubicOut);
    });
  }

  private _initStar() {
    this.star = new createjs.Container();
    const star = new createjs.Bitmap('/images/yellow-star.png');
    star.x = -8;
    star.y = -9;
    this.star.addChild(star);
    this.addChild(this.star);
  }
  private _initLines() {
    this.lines = [];
    _.times(10, (i) => {
      const lineContainer = new createjs.Container();
      const width = Math.floor(Math.random() * 5) + 5;
      const line = new createjs.Shape();
      line.graphics
        .beginStroke('red')
        .moveTo(0, 0)
        .lineTo(width, 0);
      line.x = line.y = 0;
      lineContainer.addChild(line);
      lineContainer.x = lineContainer.y = 0;
      lineContainer.rotation = 360 / 10 * i;
      lineContainer.alpha = 0;
      this.addChild(lineContainer);
      this.lines.push(lineContainer);
    });
  }
}
