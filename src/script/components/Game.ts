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

export default class Game extends createjs.Container {
  private _options: IGameOptions;
  private _holdBlock: HoldBlock;
  private _nextBlocks: NextBlocks;
  private _board: Board;
  private _keyController: KeyController;
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
    this._initHoldBoard();
    this._initNextBlocks();
    this._initBoard();
    this._initKeyController();
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
    this._nextBlocks
      .refreshBlocks()
      .showBlocks();
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
      this._board.moveBlock('down');
    };
    this._keyController.onKeydown.left = () => {
      this._board.moveBlock('left');
    };
    this._keyController.onKeydown.right = () => {
      this._board.moveBlock('right');
    };
    this._keyController.onKeydown.up = () => {
      this._board.activeBlockRotation++;
    };
    this._keyController.onKeydown.enter = () => {
      this.start();
    };
  }
}
