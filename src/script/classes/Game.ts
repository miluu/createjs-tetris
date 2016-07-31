/// <reference path="../../../typings/index.d.ts" />

import Board from './Board';
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

const levelsStepInterval: number[] = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];

export default class Game extends createjs.Container {
  public level: number;
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
  private _isPause: boolean;
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
    this.level = 0;
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
      if (!this._isStarted || this._isPause) {
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
      if (!this._isStarted || this._isPause) {
        return;
      }
      this._board.moveBlock('left');
    };
    this._keyController.onKeydown.right = () => {
      console.log('key: right');
      if (!this._isStarted || this._isPause) {
        return;
      }
      this._board.moveBlock('right');
    };
    this._keyController.onKeydown.up = () => {
      console.log('key: up');
      if (!this._isStarted || this._isPause) {
        return;
      }
      this._board.activeBlockRotation++;
    };
    this._keyController.onKeydown.z = () => {
      console.log('key: z');
      if (!this._isStarted || this._isPause || this._isHolded) {
        return;
      }
      this._hold();
    };
    this._keyController.onKeydown.enter = () => {
      if (!this._isStarted) {
        this.start();
      } else {
        this._isPause = !this._isPause;
        if (this._isPause) {
          this._stopAutoFall();
        } else {
          this._autoFall();
        }
      }
    };
  }
  private _getLevelFrames(level: number) {
    return this._levelFrames[level] || _.last(this._levelFrames);
  }
  private _setLevelFrames() {
    this._levelFrames = [];
    _.forEach(levelsStepInterval, (stepInterval) => {
      const frames = Math.round(stepInterval * this._fps / 1000);
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
    this._levelStepsCount++;
    if (this._levelStepsCount >= this._getLevelFrames(this.level)) {
      this._levelStepsCount = 0;
      const canMove = this._board.moveBlock('down');
      if (!canMove) {
        this._nextRound();
      }
    }
  }
  private _nextRound() {
    const outRangeCellsPos = this._board.blockToMap();
    this._board.clearFullRow();
    if (outRangeCellsPos.length) {
      this._gameOver();
      return;
    }
    this._isHolded = false;
    this._board.resetActiveBlock(this._nextBlocks.next());
    this._board.resetActiveBlockPos();
  }
  private _gameOver() {
    alert('Game Over!');
    this._keyController.clearKeyDown();
    this._initGameStatus();
  }
  private _initGameStatus() {
    this._isStarted = false;
    this._isPause = false;
    this._isHolded = false;
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
}
