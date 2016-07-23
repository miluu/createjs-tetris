/// <reference path="../../../typings/index.d.ts" />

import Cell from './cell';
import * as _ from 'lodash';

interface IBlockCell {
  x: number;
  y: number;
}

export default class Block extends createjs.Container {
  direction: number;
  constructor(public cellWidth: number = 30, public blockType?: string, direction: number = 0 ) {
    super();
    // if (!_.includes(this._allTypes(), blockType)) {
    //   this.blockType = this._randomType();
    // }
    this.blockType = Block.Type.O;
    this.direction = Math.floor(direction) % 4;
    this._buildCells();
  }

  private _buildCells(): void {
    const cells: Cell[] = [];
    const shape = this._getShape();
    const shapeDirectionCount = shape.length;
    const direction = this.direction % shapeDirectionCount;
    const directionShape = shape[direction];
    _.forEach(directionShape, (blockCell) => {
      const cell = new Cell(this.cellWidth);
      cell.x = blockCell.x * this.cellWidth;
      cell.y = blockCell.y * this.cellWidth;
      this.addChild(cell);
    });
  }

  private _randomType(): string {
    const types = this._allTypes();
    const typesCount = types.length;
    const r = Math.floor(Math.random() * typesCount);
    return types[r];
  }

  private _allTypes(): string[] {
    let types: string[] = [];
    _.forIn(Block.Type, function(blockType) {
      types.push(blockType);
    });
    return types;
  }

  private _getShape(): IBlockCell[][] {
    return Block._shapes[this.blockType];
  }

  private static _shapes: {[key: string]: IBlockCell[][]} = {
    O: [
      [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]
    ]
  };

  static Type = {
    O: 'O',
    L: 'L',
    J: 'J',
    S: 'S',
    Z: 'Z',
    T: 'T',
    I: 'I'
  };
}
