/// <reference path="../../../typings/index.d.ts" />

export default class Infos extends createjs.Container {
  private _levelPanel: createjs.Text;
  private _linesPanel: createjs.Text;
  private _scorePanel: createjs.Text;
  private _levelTitle: string;
  private _linesTitle: string;
  private _scoreTitle: string;
  private _level: number;
  private _rows: number;
  private _score: number;
  constructor(fontsize: number) {
    super();
    this._levelTitle = 'LEVEL';
    this._level = 0;
    this._initLevel(fontsize);
    this._linesTitle = 'LINES';
    this._rows = 0;
    this._initRows(fontsize);
    this._scoreTitle = 'SCORE';
    this._score = 0;
    this._initScore(fontsize);
  }
  get level(): number {
    return this._level;
  }
  set level(lv: number) {
    this._level = lv;
    this._update();
  }
  get rows(): number {
    return this._rows;
  }
  set rows(rowsCount: number) {
    this._rows = rowsCount;
    this._update();
  }
  get score(): number {
    return this._rows;
  }
  set score(scoreCount: number) {
    this._score = scoreCount;
    this._update();
  }
  private _initLevel(fontsize: number) {
    this._levelPanel = new createjs.Text(this._levelTitle);
    this._levelPanel.font = `${fontsize}px Arial`;
    this.addChild(this._levelPanel);
  }
  private _initRows(fontsize: number) {
    this._linesPanel = new createjs.Text(this._linesTitle);
    this._linesPanel.font = `${fontsize}px Arial`;
    this._linesPanel.y = fontsize * 2;
    this.addChild(this._linesPanel);
  }
  private _initScore(fontsize: number) {
    this._scorePanel = new createjs.Text(this._scoreTitle);
    this._scorePanel.font = `${fontsize}px Arial`;
    this._scorePanel.y = fontsize * 4;
    this.addChild(this._scorePanel);
  }
  private _update() {
    this._levelPanel.text = `${this._levelTitle}: ${this._level}`;
    this._linesPanel.text = `${this._linesTitle}: ${this._rows}`;
    this._scorePanel.text = `${this._scoreTitle}: ${this._score}`;
  }
}
