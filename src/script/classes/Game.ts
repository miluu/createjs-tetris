/// <reference path="../../../typings/index.d.ts" />

import Board from './Board';
import Block from './Block';
import HoldBlock from './HoldBlock';
import NextBlocks from './NextBlocks';
import KeyController from './KeyController';
import * as _ from 'lodash';

interface IGameOptions {
  cellWidth?: number;
  colsCount?: number;
  rowsCount?: number;
  nextBlockCount?: number;
  stageCanvas?: HTMLCanvasElement | HTMLElement | Window;
}

interface IScale {
  scale: number;
}

interface IPosition {
  x: number;
  y: number;
}

interface ILevel {
  level: number;
  stepInterval: number;
}

interface IRecord {
  score: number;
  highScore: {time: Date, score: number}[];
  clearRowCount: number;
  clearCountByRows: number[];
  blockCount: number;
  blockCountByTypes: {
    [blockType: string]: number;
  };
}

const levelsStepInterval: number[] = [1800, 1500, 1200, 1000, 800, 700, 600, 500, 400, 300, 200, 150, 100, 70, 50, 30];

export default class Game extends createjs.Container {
  private _level: number;
  private _levelUpRows: number;
  private _options: IGameOptions;
  private _holdBlock: HoldBlock;
  private _nextBlocks: NextBlocks;
  private _board: Board;
  private _keyController: KeyController;
  private _fps: number;
  private _levelStepsCount: number;
  private _levelFrames: number[];
  private _tickerListener: Function;
  private _isStarted: boolean;
  private _isHolded: boolean;
  private _isPaused: boolean;
  private _isFrozen: boolean;
  private _record: IRecord;
  constructor(options?: IGameOptions) {
    super();
    const defaultOptions: IGameOptions = {
      cellWidth: 30,
      colsCount: 10,
      rowsCount: 20,
      nextBlockCount: 4,
      stageCanvas: window
    };
    this._options = _.assign({}, defaultOptions, options);
    const {cellWidth} = this._options;
    this._fps = createjs.Ticker.getFPS();
    this._level = 0;
    this._levelUpRows = 30;
    this._setLevelFrames();
    this._initHoldBoard();
    this._initNextBlocks();
    this._initBoard();
    this._initKeyController();
    this._initGameStatus();
    this.setHoldBoard({
      scale: 0.5,
      x: cellWidth,
      y: cellWidth
    });
    this.setBoard({
      scale: 1,
      x: cellWidth * 4,
      y: cellWidth
    });
    this.setNextBlocks({
      scale: 0.5,
      x: cellWidth * 15,
      y: cellWidth
    });
  }
  public start() {
    this._initGameStatus();
    this._initRecord();
    this._board.clear();
    this._keyController.clearKeyDown();
    this._isStarted = true;
    this._nextBlocks
      .refreshBlocks()
      .showBlocks();
    this._autoFall();
  }
  public setHoldBoard(options: IScale & IPosition) {
    this._holdBlock.x = options.x;
    this._holdBlock.y = options.y;
    this._holdBlock.scaleX = this._holdBlock.scaleY = options.scale;
  }
  public setBoard(options: IScale & IPosition) {
    this._board.x = options.x;
    this._board.y = options.y;
    this._board.scaleX = this._board.scaleY = options.scale;
  }
  public setNextBlocks(options: IScale & IPosition) {
    this._nextBlocks.x = options.x;
    this._nextBlocks.y = options.y;
    this._nextBlocks.scaleX = this._nextBlocks.scaleY = options.scale;
  }
  public wait(frames: number, frozen: boolean, callback?: Function) {
    let spendFrames = 0;
    const counter = createjs.Ticker.on('tick', countFrames);
    if (frozen) {
      this._isFrozen = true;
    }
    const _this = this;
    function countFrames() {
    console.log(spendFrames);
      spendFrames++;
      if (spendFrames >= frames) {
        createjs.Ticker.off('tick', counter);
        if (callback) {
          callback();
        }
        if (frozen) {
          _this._isFrozen = false;
        }
      }
    }
  }
  public msToFrames(ms: number): number {
    return Math.round(ms * this._fps / 1000);
  }
  private _initHoldBoard() {
    const {cellWidth} = this._options;
    this._holdBlock = new HoldBlock(cellWidth);
    this.addChild(this._holdBlock);
  }
  private _initNextBlocks() {
    const {cellWidth, nextBlockCount} = this._options;
    this._nextBlocks = new NextBlocks(nextBlockCount, cellWidth);
    this._nextBlocks.hideBlocks();
    this.addChild(this._nextBlocks);
  }
  private _initBoard() {
    const {cellWidth, colsCount, rowsCount} = this._options;
    this._board = new Board(cellWidth, colsCount, rowsCount);
    this.addChild(this._board);
    (<any>window).board = this._board;
  }
  private _initKeyController() {
    const {stageCanvas} = this._options;
    this._keyController = new KeyController(stageCanvas);
    this._keyController.onKeydown.down = () => {
      console.log('key: down');
      if (!this._isStarted || this._isPaused ||  this._isFrozen) {
        return;
      }
      const canMove = this._board.moveBlock('down');
      if (!canMove) {
        this._nextRound();
      }
      this._levelStepsCount = 0;
    };
    this._keyController.onKeydown.left = () => {
      console.log('key: left');
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.moveBlock('left');
    };
    this._keyController.onKeydown.right = () => {
      console.log('key: right');
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.moveBlock('right');
    };
    this._keyController.onKeydown.space = () => {
      console.log('key: space');
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.fallDown();
      this._nextRound();
    };
    this._keyController.onKeydown.up = () => {
      console.log('key: up');
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.activeBlockRotation++;
    };
    this._keyController.onKeydown.z = () => {
      console.log('key: z');
      if (!this._isStarted || this._isPaused || this._isHolded) {
        return;
      }
      this._hold();
    };
    this._keyController.onKeydown.enter = () => {
      if (!this._isStarted) {
        this.start();
      } else {
        this._isPaused = !this._isPaused;
      }
    };
  }
  private _getLevelFrames(level: number) {
    return this._levelFrames[level] || _.last(this._levelFrames);
  }
  private _setLevelFrames() {
    this._levelFrames = [];
    _.forEach(levelsStepInterval, (stepInterval) => {
      const frames = this.msToFrames(stepInterval);
      this._levelFrames.push(frames);
    });
  }
  private _autoFall() {
    createjs.Ticker.off('tick', this._tickerListener);
    this._tickerListener = createjs.Ticker.on('tick', this._stepsCount.bind(this));
  }
  private _stopAutoFall() {
    createjs.Ticker.off('tick', this._tickerListener);
  }
  private _stepsCount() {
    if (this._isFrozen || this._isPaused) {
      return;
    }
    this._levelStepsCount++;
    if (this._levelStepsCount >= this._getLevelFrames(this._level)) {
      this._levelStepsCount = 0;
      const canMove = this._board.moveBlock('down');
      if (!canMove) {
        this._nextRound();
      }
    }
  }
  private _nextRound() {
    const outRangeCellsPos = this._board.blockToMap();
    if (outRangeCellsPos.length) {
      this._gameOver();
      return;
    }
    this._isHolded = false;
    const rows = this._board.getFullRow();
    let ms = 300;
    let hasClearRows = false;
    if (rows.length) {
      hasClearRows = true;
    }
    this.wait(this.msToFrames(ms * (hasClearRows ? 2 : 1)), true);
    this.wait(this.msToFrames(ms), false, () => {
      this._board.resetActiveBlock(this._nextBlocks.next());
      this._board.resetActiveBlockPos();
      this._board.resetRow(rows);
    });
    if (hasClearRows) {
      this.wait(this.msToFrames(ms * (hasClearRows ? 2 : 1)), false, () => {
        this._board.clearRow(rows);
      });
    }
  }
  private _gameOver() {
    alert('Game Over!');
    this._keyController.clearKeyDown();
    this._initGameStatus();
  }
  private _initGameStatus() {
    this._isStarted = false;
    this._isPaused = false;
    this._isHolded = false;
    this._isFrozen = false;
    this._levelStepsCount = 0;
    this._stopAutoFall();
  }
  private _hold() {
    this._isHolded = true;
    const holdBlockInfo = this._holdBlock.hold(this._board.getActiveBlockInfo());
    if (holdBlockInfo) {
      this._board.resetActiveBlock(holdBlockInfo);
      this._board.resetActiveBlockPos();
    } else {
      this._board.resetActiveBlock(this._nextBlocks.next());
      this._board.resetActiveBlockPos();
    }
  }
  private _initRecord() {
    this._record = {
      score: 0,
      highScore: [],
      clearRowCount: 0,
      clearCountByRows: [0, 0, 0, 0],
      blockCount: 0,
      blockCountByTypes: {
        [Block.Type.I]: 0,
        [Block.Type.J]: 0,
        [Block.Type.L]: 0,
        [Block.Type.O]: 0,
        [Block.Type.S]: 0,
        [Block.Type.Z]: 0,
        [Block.Type.T]: 0,
      }
    };
  }
}
