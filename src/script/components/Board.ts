/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';
import Cell from './Cell';
import Block, {IBlockInfo} from './Block';

interface IMapPosition {
  row: number;
  col: number;
}
type TMoveDirection = 'left' | 'right' | 'down';
export default class Board extends createjs.Container {
  private _bg: createjs.Shape;
  private _map: number[][];
  private _cells: Cell[][];
  private _activeBlock: Block;
  private _activeBlockPosition: IMapPosition;
  constructor(
    private _cellWidth: number = 30,
    private _colsCount: number = 10,
    private _rowsCount: number = 20
  ) {
    super();
    this._init();
  }

  public resetActiveBlock(blockInfo: IBlockInfo) {
    this._activeBlock.blockRotation = blockInfo.blockRotation;
    this._activeBlock.blockType = blockInfo.blockType;
    this.resetActiveBlockPos();
    this.showActiveBlock();
  }

  public resetActiveBlockPos() {
    const rotationShape = this._activeBlock.getRotationShape();
    console.log(rotationShape);
  }

  public showActiveBlock() {
    this._activeBlock.visible = true;
  }

  public hideActiveBlock() {
    this._activeBlock.visible = false;
  }

  public getWidth(): number {
    return this._cellWidth * this._colsCount;
  }

  public getHeight(): number {
    return this._cellWidth * this._rowsCount;
  }

  public setMap(position: IMapPosition, val: number) {
    const {row, col} = position;
    if (val !== 0 && val !== 1) {
      throw new Error('val can only be 0 or 1.');
    }
    if (row > this._rowsCount - 1 || row < 0 || col > this._colsCount || col < 0) {
      throw new Error(`Out of map's range.`);
    }
    this._map[row][col] = val;
    this._updateMapView();
  }

  public moveBlock(direction: TMoveDirection) {
    const {canMove, newPosition} = this._beforeMoveBlock(direction);
    if (!canMove) {
      return;
    }
    this._activeBlockPosition = newPosition;
    this._updateActiveBlockPosition();
  }

  get map(): number[][] {
    return this._map;
  }
  set map(map: number[][]) {
    this._map = map;
    this._updateMapView();
  }

  get activeBlockRotation() {
    return this._activeBlock.blockRotation;
  }
  set activeBlockRotation(blockRotation: number) {
    this._activeBlock.blockRotation = blockRotation;
  }

  private _init(): void {
    this._initBg();
    this._initMap();
    this._initCells();
    this._initActiveBoard();
    this._updateMapView();
  }

  private _initActiveBoard() {
    this._activeBlock = new Block(this._cellWidth);
    this._activeBlockPosition = {col: 3, row: 0};
    this._updateActiveBlockPosition();
    this.addChild(this._activeBlock);
  }

  private _initBg(): void {
    this._bg = new createjs.Shape();
    this._bg.graphics
      .beginFill('rgba(0, 0, 0, 0.5)')
      .drawRect(0, 0, this.getWidth(), this.getHeight());
    this.addChild(this._bg);
  }

  private _initMap(): void {
    this._map = [];
    const mapRow = new Array(this._colsCount);
    _.fill(mapRow, 0);
    _.times(this._rowsCount, () => {
      this._map.push(mapRow.concat());
    });
  }

  private _initCells(): void {
    this._cells = [];
    _.times(this._rowsCount, (row) => {
      const cellsRow: Cell[] = [];
      _.times(this._colsCount, (col) => {
        const cell = new Cell(this._cellWidth);
        cell.x = col * this._cellWidth;
        cell.y = row * this._cellWidth;
        this.addChild(cell);
        cellsRow.push(cell);
      });
      this._cells.push(cellsRow);
    });
  }

  private _updateMapView(): void {
    _.forEach(this._map, (mapRow, row) => {
      _.forEach(mapRow, (cellState, col) => {
        const cell = this._cells[row][col];
        cell.alpha = cellState === 0
          ? 0.1
          : 0.8;
      });
    });
  }

  private _updateActiveBlockPosition(): void {
    const {col, row} = this._activeBlockPosition;
    const x = col * this._cellWidth;
    const y = row * this._cellWidth;
    this._activeBlock.x = x;
    this._activeBlock.y = y;
  }

  private _activeBlockToMapPostion(position = this._activeBlockPosition, rotationShape = this._activeBlock.getRotationShape()): IMapPosition[] {
    const ret: IMapPosition[] = [];
    _.forEach(rotationShape, (cellPos) => {
      ret.push({
        col: position.col + cellPos.x,
        row: position.row + cellPos.y
      });
    });
    return ret;
  }

  private _beforeMoveBlock(direction: TMoveDirection): {canMove: boolean, newPosition: IMapPosition} {
    let canMove = true;
    let newPosition: IMapPosition = _.assign({}, this._activeBlockPosition) as IMapPosition;
    switch (direction) {
      case 'down':
        newPosition.row++;
        break;
      case 'left':
        newPosition.col--;
        break;
      case 'right':
        newPosition.col++;
        break;
      default:
        break;
    }
    const newBlockMapPosition = this._activeBlockToMapPostion(newPosition);
    _.forEach(newBlockMapPosition, (mapPos) => {
      const {col, row} = mapPos;
      if (_.get(this.map, `[${row}][${col}]`) === 1 || col < 0 || col > this._colsCount - 1 || row > this._rowsCount - 1) {
        canMove = false;
        return false;
      }
    });
    return {canMove, newPosition};
  }

}
