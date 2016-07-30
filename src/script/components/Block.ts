/// <reference path="../../../typings/index.d.ts" />

import Cell from './cell';
import * as _ from 'lodash';

export interface IBlockCell {
  x: number;
  y: number;
}

export interface IBlockInfo {
  blockType: string;
  blockRotation: number;
}

export default class Block extends createjs.Container {
  private _blockRotation: number;
  private _blockType: string;
  private _cells: Cell[];

  constructor(
    private _cellWidth: number = 30,
    blockType?: string,
    blockRotation?: number
  ) {
    super();
    if (!_.includes(Block._allTypes(), blockType)) {
      this.blockType = Block.randomType();
    } else {
      this.blockType = blockType;
    }
    if (_.isUndefined(blockRotation)) {
      blockRotation = Block.randomRotation();
    }
    this.blockRotation = blockRotation;
  }

  public getRealShapeInfo() {
    const rotationShape = this.getRotationShape();
    const minX = _.minBy(rotationShape, 'x').x;
    const minY = _.minBy(rotationShape, 'y').y;
    const maxX = _.maxBy(rotationShape, 'x').x;
    const maxY = _.maxBy(rotationShape, 'y').y;
    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };
  }

  public getBlockInfo(): IBlockInfo {
    return {
      blockType: this.blockType,
      blockRotation: this.blockRotation,
    };
  }

  public getRotationShape(blockRotation = this._blockRotation): IBlockCell[] {
    const shape = this._getShape();
    const shapeBlockRotationCount = shape.length;
    const rotationShape = shape[blockRotation % shapeBlockRotationCount];
    return rotationShape;
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

  private _buildCells(): void {
    const cells: Cell[] = [];
    _.times(4, () => {
      const cell = new Cell(this._cellWidth);
      cells.push(cell);
      this.addChild(cell);
    });
    this._cells = cells;
  }

  private _update() {
    const rotationShape = this.getRotationShape();
    _.forEach(rotationShape, (cellPos, i) => {
      this._cells[i].x = this._cellWidth * cellPos.x;
      this._cells[i].y = this._cellWidth * cellPos.y;
    });
  }

  static randomType(): string {
    const types = this._allTypes();
    const typesCount = types.length;
    const r = Math.floor(Math.random() * typesCount);
    return types[r];
  }

  static randomRotation(): number {
    return Math.floor(Math.random() * 4);
  }

  private static _allTypes(): string[] {
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
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 0, y: 2}],
      [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0}]
    ],
    J: [
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}],
      [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
      [{x: 2, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}]
    ],
    S: [
      [{x: 2, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}],
      [{x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}],
      [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}]
    ],
    Z: [
      [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}],
      [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 2}]
    ],
    T: [
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 0}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}],
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 1}]
    ],
    I: [
      [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}],
      [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}],
      [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}],
      [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]
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
