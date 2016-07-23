/// <reference path="../../../typings/index.d.ts" />

import Cell from './cell';
import * as _ from 'lodash';

interface IBlockCell {
  x: number;
  y: number;
}

export default class Block extends createjs.Container {
  private _blockRotation: number;
  private _blockType: string;
  private _cells: Cell[];
  constructor(public cellWidth: number = 30, blockType?: string, blockRotation: number = 0 ) {
    super();
    if (!_.includes(this._allTypes(), blockType)) {
      console.log(1);
      this.blockType = this._randomType();
    } else {
      this.blockType = blockType;
    }
    this.blockRotation = blockRotation;
  }

  private _buildCells(): void {
    const cells: Cell[] = [];
    _.times(4, () => {
      const cell = new Cell(this.cellWidth);
      cells.push(cell);
      this.addChild(cell);
    });
    this._cells = cells;
  }

  get blockType() {
    return this._blockType;
  }
  set blockType(blockType: string) {
    this._blockType = blockType;
    this._update();
  }

  get blockRotation() {
    return this._blockRotation;
  };
  set blockRotation(blockRotation: number) {
    if (!this._cells) {
      this._buildCells();
    }
    blockRotation = Math.floor(Math.abs(blockRotation)) % 4;
    this._blockRotation = blockRotation;
    this._update();
  }

  private _update() {
    const shape = this._getShape();
    const shapeBlockRotationCount = shape.length;
    const rotationShape = shape[this._blockRotation % shapeBlockRotationCount];
    _.forEach(rotationShape, (cellPos, i) => {
      this._cells[i].x = this.cellWidth * cellPos.x;
      this._cells[i].y = this.cellWidth * cellPos.y;
    });
  }

  private _randomType(): string {
    console.log(2);
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
    ],
    L: [
      [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}],
      [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 0, y: 3}],
      [{x: -1, y: 2}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}],
      [{x: -2, y: 2}, {x: -1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}]
    ],
    J: [
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}],
      [{x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}],
      [{x: 2, y: 2}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}],
      [{x: -1, y: 2}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y: 3}]
    ],
    S: [
      [{x: 2, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}]
    ],
    Z: [
      [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}],
      [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}]
    ],
    T: [
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 0}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 1}]
    ],
    I: [
      [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}],
      [{x: -1, y: 2}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}]
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
