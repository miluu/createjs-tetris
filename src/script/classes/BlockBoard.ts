/// <reference path="../../../typings/index.d.ts" />

import Block from './Block';
import * as utils from '../utils';

export default class BlockBoard extends createjs.Container {
  block: Block;
  constructor(
    public blockType?: string,
    public blockRotation?: number,
    private _cellWidth: number = 30,
    private _colsCount: number = 4,
    private _rowsCount: number = 4
  ) {
    super();
    this._createBg();
    this._createBlock();
    this.updateBlockPosition();
    this.showBlock();
  }

  showBlock() {
    this.addChild(this.block);
  }

  hideBlock() {
    this.removeChild(this.block);
  }

  changeBlock(blockType: string, blockRotation: number) {
    this.block.blockType = blockType;
    this.block.blockRotation = blockRotation;
    this.updateBlockPosition();
  }

  changeRandom() {
    const randomType = Block.randomType();
    const randomRotation = Block.randomRotation();
    const color = utils.randomColor(true);
    this.changeBlock(randomType, randomRotation);
    this.block.color = color;
  }

  updateBlockPosition() {
    const blockInfo = this.block.getRealShapeInfo();
    this.block.x = ((this._colsCount - blockInfo.width) / 2 - blockInfo.x) * this._cellWidth;
    this.block.y = ((this._rowsCount - blockInfo.height) / 2 - blockInfo.y) * this._cellWidth;
  }

  private _createBg() {
    const bg = new createjs.Shape();
    bg.graphics
      .beginFill('rgba(0, 0, 0, 0.5)')
      .drawRect(0, 0, this._cellWidth * this._colsCount, this._cellWidth * this._rowsCount);
    this.addChild(bg);
  }

  private _createBlock() {
    this.block = new Block(this._cellWidth, this.blockType, this.blockRotation);
  }
}
