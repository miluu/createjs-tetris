/// <reference path="../../../typings/index.d.ts" />

import BlockBoard from './BlockBoard';
import Block from './Block';
import * as _ from 'lodash';

interface IBlockInfo {
  blockType: string;
  blockRotation: number;
}

export default class HoldBlock extends createjs.Container {
  private _blockBoard: BlockBoard;
  private _title: createjs.Text;
  private _blockInfo: IBlockInfo;
  constructor(private _cellWidth: number = 30, private _colsCount: number = 4, private _rowsCount = 4) {
    super();
    this._blockInfo = null;
    this._init();
  }

  getBlockInfo(): IBlockInfo {
      return this._blockInfo;
  }

  hold(blockInfo: IBlockInfo) {
    if (!blockInfo) {
      return;
    }
    const holdBlockInfo = this.getBlockInfo();
    this._blockBoard.changeBlock(blockInfo.blockType, blockInfo.blockRotation);
    this._blockBoard.showBlock();
    this._blockInfo = blockInfo;
    return holdBlockInfo;
  }

  private _init() {
    this._initBlockBoard();
    this._initTitle();
  }

  private _initTitle() {
    const titleStr = 'HOLD';
    const title = new createjs.Text(titleStr);
    title.font = `${this._cellWidth}px Arial`;
    const width = title.getMeasuredWidth();
    title.x = (this._colsCount * this._cellWidth - width) / 2;
    this._title = title;
    this.addChild(title);
  }

  private _initBlockBoard() {
    const blockBoard = new BlockBoard(Block.Type.O, 0, this._cellWidth, this._colsCount, this._rowsCount);
    blockBoard.x = 0;
    blockBoard.y = 1.5 * this._cellWidth;
    blockBoard.hideBlock();
    this.addChild(blockBoard);
    this._blockBoard = blockBoard;
  }
}
