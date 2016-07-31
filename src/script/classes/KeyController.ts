/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';

export const KEY = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space: 32,
  enter: 13,
  z: 90
};

type keyboardMehtod = (e?: KeyboardEvent) => void;

interface IKeyControllerMehtods {
  up?: keyboardMehtod;
  down?: keyboardMehtod;
  left?: keyboardMehtod;
  right?: keyboardMehtod;
  space?: keyboardMehtod;
  enter?: keyboardMehtod;
  z?: keyboardMehtod;
  [key: string]: keyboardMehtod;
}

interface IIntervaller {
  [key: string]: number;
}

interface IIntervalFirst {
  [key: string]: boolean;
}

export default class KeyController {
  private _intervaller: IIntervaller;
  private _intervalFirst: IIntervalFirst;
  private _enableKeys: number[];
  constructor(
    private _dom: HTMLCanvasElement | HTMLElement | Window = window,
    public onKeydown?: IKeyControllerMehtods,
    public interval: number = 50,
    public firstIntervalRatio: number = 3,
    private _enabled: boolean = true
  ) {
    this._intervalFirst = {};
    this._intervaller = {};
    this.onKeydown = {};
    this._enableKeys = [];
    _.forIn(KEY, (keyCode, keyName) => {
      this._enableKeys.push(keyCode);
      this._intervaller[keyName] = null;
      this._intervalFirst[keyName] = true;
      this.onKeydown[keyName] = null;
    });
    this.enabled = _enabled;
    this._listen();
  }
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(_enabled: boolean) {
    if (_enabled) {
      this.enable();
      return;
    }
    this.disable();
  }
  enable() {
    this._enabled = true;
  }
  disable() {
    this._enabled = false;
  }
  toggle() {
    this._enabled = !this._enabled;
  }
  clearKeyDown() {
    _.forIn(KEY, (keyCode, keyName) => {
      clearInterval(this._intervaller[keyName]);
      clearTimeout(this._intervaller[keyName]);
    });
  }
  private _listen() {
    this._dom.addEventListener('keydown', this._keyDown.bind(this));
    this._dom.addEventListener('keyup', this._keyUp.bind(this));
  }
  private _keyDown(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    const {keyCode} = e;
    const keyName = this._getKeyName(keyCode);
    if (!keyName) {
      return;
    }
    const cb = this.onKeydown[keyName];
    if (this._intervalFirst[keyName]) {
      if (this._enabled && cb) {
        cb(e);
      }
      this._intervalFirst[keyName] = false;
      this._intervaller[keyName] = setTimeout(() => {
        if (this._enabled && cb) {
          cb(e);
        }
        this._intervaller[keyName] = setInterval(() => {
          if (this._enabled && cb) {
            cb(e);
          }
        }, this.interval);
      }, this._getFirstInterval());
    }
  }
  private _getFirstInterval(): number {
    return this.firstIntervalRatio * this.interval;
  }
  private _getKeyName(keyCode: number): string {
     const keyName = _.findKey(KEY, (o) => {
       return o === keyCode;
     });
     return keyName;
  }
  private _keyUp(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    const {keyCode} = e;
    const keyName = this._getKeyName(keyCode);
    clearInterval(this._intervaller[keyName]);
    clearTimeout(this._intervaller[keyName]);
    this._intervalFirst[keyName] = true;
  }
}
