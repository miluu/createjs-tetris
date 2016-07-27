/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';

export const KEY = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32,
  ENTER: 13
};

export default class KeyController {
  private _pressedKeys: number[];
  constructor(on: boolean = true) {
    this._pressedKeys = [];
    if (on) {
      this.on();
    }
  }
  on() {
    this._listen();
  }
  off() {
    this._unListen();
    this._pressedKeys = [];
  }
  public getPressedKeys() {
    return this._pressedKeys;
  }
  private _listen() {
    window.addEventListener('keydown', this._keyDown.bind(this));
    window.addEventListener('keyup', this._keyUp.bind(this));
  }
  private _keyDown(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    const {keyCode} = e;
    switch (e.keyCode) {
      case KEY.UP:
      case KEY.DOWN:
      case KEY.LEFT:
      case KEY.RIGHT:
      case KEY.SPACE:
      case KEY.ENTER:
        if (!_.includes(this._pressedKeys, keyCode)) {
          this._pressedKeys.push(keyCode);
          console.log(this._prettyPressedKeys());
        }
        break;
      default:
        break;
    }
  }
  private _keyUp(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    const {keyCode} = e;
    switch (e.keyCode) {
      case KEY.UP:
      case KEY.DOWN:
      case KEY.LEFT:
      case KEY.RIGHT:
      case KEY.SPACE:
      case KEY.ENTER:
        _.pull(this._pressedKeys, keyCode);
        console.log(this._prettyPressedKeys());
        break;
      default:
        break;
    }
  }
  private _unListen() {
    const keyDown = this._keyDown.bind(this);
    const keyUp = this._keyUp.bind(this);
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
  }
  private _prettyPressedKeys(): string[] {
    const ret: string[] = [];
    _.forEach(this._pressedKeys, (keyCode) => {
      switch (keyCode) {
        case KEY.UP:
          ret.push('↑');
          break;
        case KEY.DOWN:
          ret.push('↓');
          break;
        case KEY.LEFT:
          ret.push('←');
          break;
        case KEY.RIGHT:
          ret.push('→');
          break;
        case KEY.SPACE:
          ret.push('□');
          break;
        case KEY.ENTER:
          ret.push('✓');
          break;
      }
    });
    return ret;
  }
}
