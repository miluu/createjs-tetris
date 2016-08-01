/// <reference path="../../../typings/index.d.ts" />

export default class InfoPanel extends createjs.Container {
  private _levelPanel: createjs.Text;
  private _title: string;
  private _level: number;
  constructor(fontsize: number) {
    super();
    this._title = 'LEVEL';
    this._level = 0;
    this._initText(fontsize);
  }
  get level(): number {
    return this._level;
  }
  set level(lv: number) {
    this._level = lv;
    this._update();
  }
  private _initText(fontsize: number) {
    this._levelPanel = new createjs.Text(this._title);
    this._levelPanel.font = `${fontsize}px Arial`;
    this.addChild(this._levelPanel);
  }
  private _update() {
    this._levelPanel.text = `${this._title}: ${this._level}`;
  }
}
