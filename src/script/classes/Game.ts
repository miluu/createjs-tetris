/// <reference path="../../../typings/index.d.ts" />

import Board from './Board';
import Block from './Block';
import HoldBlock from './HoldBlock';
import NextBlocks from './NextBlocks';
import Infos from './Infos';
import KeyController from './KeyController';
import Star from './Star';
import Firefly from './Firefly';
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
  clearLines: number;
  clearCountByLines: number[];
  blockCount: number;
  blockCountByTypes: {
    [blockType: string]: number;
  };
}

const levelsStepInterval: number[] = [1800, 1500, 1200, 1000, 800, 700, 600, 500, 400, 300, 200, 150, 100, 70, 50, 30];

export default class Game extends createjs.Container {
  private _level: number;
  private _levelUpRows: number;
  private _clearRowsScore: number[];
  private _options: IGameOptions;
  private _holdBlock: HoldBlock;
  private _nextBlocks: NextBlocks;
  private _board: Board;
  private _infoPanel: Infos;
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
    this._levelUpRows = 30;
    this._clearRowsScore = [100, 300, 600, 1000];
    this._setLevelFrames();
    this._initHoldBoard();
    this._initNextBlocks();
    this._initBoard();
    this._initInfoPanel();
    this._initKeyController();
    this._initGameStatus();
    this.level = 0;
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
    this.level = 0;
    this._infoPanel.score = 0;
    this._infoPanel.rows = 0;
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
  get level(): number {
    return this._level;
  }
  set level(lv: number) {
    this._level = lv;
    this._infoPanel.level = lv;
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
  }
  private _initInfoPanel() {
    this._infoPanel = new Infos(this._options.cellWidth / 2);
    this._infoPanel.x = this._options.cellWidth;
    this._infoPanel.y = (this._options.rowsCount - 6) * this._options.cellWidth;
    this.addChild(this._infoPanel);
  }
  private _initKeyController() {
    const {stageCanvas} = this._options;
    this._keyController = new KeyController(stageCanvas);
    this._keyController.onKeydown.down = () => {
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
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.moveBlock('left');
    };
    this._keyController.onKeydown.right = () => {
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.moveBlock('right');
    };
    this._keyController.onKeydown.space = () => {
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      const {x, y, width, height} = this._board.fallDown();
      this._playFirefly(x + this._board.x - 6, y + this._board.y - 6, width, height, width * height / Math.pow(this._options.cellWidth, 2) * 1);
      this._nextRound();
    };
    this._keyController.onKeydown.up = () => {
      if (!this._isStarted || this._isPaused || this._isFrozen) {
        return;
      }
      this._board.activeBlockRotation++;
    };
    this._keyController.onKeydown.z = () => {
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
    const getScore = this._clearRowsScore[rows.length - 1];
    const blockInfo = this._board.getActiveBlockInfo();
    let ms = 300;
    let hasClearLines = false;
    if (rows.length) {
      hasClearLines = true;
    }
    this.wait(this.msToFrames(ms * (hasClearLines ? 2 : 1)), true);
    this.wait(this.msToFrames(ms), false, () => {
      this._board.resetActiveBlock(this._nextBlocks.next());
      this._board.resetActiveBlockPos();
      this._board.resetRow(rows);
      this._record.blockCount++;
      this._record.blockCountByTypes[blockInfo.blockType]++;
      if (rows.length) {
        this._record.clearLines += rows.length;
        this._record.clearCountByLines[rows.length - 1]++;
        this._record.score += this._clearRowsScore[rows.length - 1];
        this._infoPanel.rows = this._record.clearLines;
        this._infoPanel.score = this._record.score;
        if (this._record.clearLines >= (this.level + 1) * 30) {
          this.level++;
        }
      }
    });
    if (hasClearLines) {
      this.wait(this.msToFrames(ms * (hasClearLines ? 2 : 1)), false, () => {
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
      clearLines: 0,
      clearCountByLines: [0, 0, 0, 0],
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
  private _playFirefly(x: number, y: number, width: number, height: number, firefliesCount: number) {
    // const stars: Star[] = [];
    // _.times(starCount, (i) => {
    //   const star = new Star();
    //   star.x = Math.round(Math.random() * width) + x;
    //   star.y = Math.round(Math.random() * height) + y;
    //   stars.push(star);
    //   this.wait(i, false, () => {
    //     this.addChild(star);
    //     this.wait(16, false, () => {
    //       this.removeChild(star);
    //     });
    //   });
    // });
    _.times(firefliesCount, (i) => {
      const firefly = new Firefly();
      firefly.x = Math.round(Math.random() * width) + x;
      firefly.y = Math.round(Math.random() * height) + y;
      this.addChild(firefly);
      firefly.animate(500, () => {
        this.removeChild(firefly);
      });
    });
  }
}
