/// <reference path="../../../typings/index.d.ts" />

export default class Cell extends createjs.Container {
  public sprite: createjs.Sprite;
  public status: 'active' | 'static';
  private _color: string;
  private _colorLayer: createjs.Shape;
  private _spriteSheet: createjs.SpriteSheet;
  private _originCellWidth: number;
  constructor(public cellWidth: number) {
    super();
    this._originCellWidth = 60;
    this._init();
  }

  public active() {
    this.status = 'active';
    this.sprite.gotoAndStop('active');
  }

  public static() {
    this.status = 'static';
    this.sprite.gotoAndStop('static');
  }

  set color(color: string) {
    this.removeChild(this._colorLayer);
    if (!color) {
      this._color = null;
      this._colorLayer = null;
    }
    this._color = color;
    const shape = new createjs.Shape();
    shape.graphics
      .beginFill(color)
      .drawRect(1, 1, 28, 28);
    shape.compositeOperation = 'color';
    this._colorLayer = shape;
    this.addChild(shape);
  }

  get color(): string {
    return this._color;
  }

  private _init(): void {
    const sheet = new createjs.SpriteSheet({
      images: ['/images/cell.png'],
      frames: {width: 60, height: 60},
      animations: {
        active: 0,
        static: 1
      }
    });
    const sprite = new createjs.Sprite(sheet, 'active');
    sprite.scaleX = sprite.scaleY = this.cellWidth / this._originCellWidth;
    this._spriteSheet = sheet;
    this.sprite = sprite;
    this.addChild(sprite);
    this._color = null;
    this._colorLayer = null;
  }
}
