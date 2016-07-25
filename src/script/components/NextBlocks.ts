/// <reference path="../../../typings/index.d.ts" />

import BlockBoard from './BlockBoard';
import Block from './Block';
import * as _ from 'lodash';

interface IBlockInfo {
  blockType: string;
  blockRotation: number;
}

export default class NextBlocks extends createjs.Container {
  private _blockBoards: BlockBoard[];
  private _title: createjs.Text;
  constructor(public blockCount: number = 1, private _cellWidth: number = 30, private _colsCount: number = 4, private _rowsCount = 4) {
    super();
    this._init();
  }

  next(): IBlockInfo {
    const nextBlocksInfo = this.getNextBlocksInfo();
    const nextBlockInfo = _.first(nextBlocksInfo);
    _.forEach(this._blockBoards, (BlockBoard, i) => {
      if (i < this.blockCount - 1) {
        const nextInfo = nextBlocksInfo[i + 1];
        BlockBoard.changeBlock(nextInfo.blockType, nextInfo.blockRotation);
      } else {
        BlockBoard.changeRandom();
      }
    });
    return nextBlockInfo;
  }

  getNextBlocksInfo(): IBlockInfo[] {
    const ret: IBlockInfo[] = [];
    _.forEach(this._blockBoards, (blockBoard) => {
      ret.push({
        blockType: blockBoard.block.blockType,
        blockRotation: blockBoard.block.blockRotation
      });
    });
    return ret;
  }

  private _init() {
    this._blockBoards = [];
    this._initBlockBoard();
    this._initTitle();
  }

  private _initTitle() {
    const titleStr = 'NEXT';
    const title = new createjs.Text(titleStr);
    title.font = `${this._cellWidth}px Arial`;
    title.lineWidth = this._cellWidth * this._colsCount;
    title.textAlign = 'center';
    this._title = title;
    this.addChild(title);
  }

  private _initBlockBoard() {
    _.times(this.blockCount, (i) => {
      const blockBoard = new BlockBoard(Block.randomType(), Block.randomRotation(), this._cellWidth, this._colsCount, this._rowsCount);
      blockBoard.x = 0;
      blockBoard.y = i * this._cellWidth * this._rowsCount + (i + 1.5) * this._cellWidth;
      this.addChild(blockBoard);
      this._blockBoards.push(blockBoard);
    });
  }
}
