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
  public activeBlock: Block;
  private _bg: createjs.Shape;
  private _map: number[][];
  private _cells: Cell[][];
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
    this.activeBlock.blockRotation = blockInfo.blockRotation;
    this.activeBlock.blockType = blockInfo.blockType;
    this.resetActiveBlockPos();
    this.showActiveBlock();
  }

  public resetActiveBlockPos() {
    this._initActiveBlockPosition();
  }

  public showActiveBlock() {
    this.activeBlock.visible = true;
  }

  public hideActiveBlock() {
    this.activeBlock.visible = false;
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

  public moveBlock(direction: TMoveDirection): boolean {
    const {canMove, newPosition} = this._beforeMoveBlock(direction);
    if (!canMove) {
      return false;
    }
    this._activeBlockPosition = newPosition;
    this._updateActiveBlockPosition();
    return true;
  }

  public fallDown() {
    const blockMapPositiion = this._activeBlockToMapPostion();
    const colsDistance: number[] = [];
    const groupedPos = _.groupBy(blockMapPositiion, 'col');
    const {width} = this.activeBlock.getRealShapeInfo();
    const minLeft = _.minBy(blockMapPositiion, 'col').col;
    const minTop = _.minBy(blockMapPositiion, 'row').row;
    _.forIn(groupedPos, (colPos: IMapPosition[]) => {
      const bottomPosition = _.maxBy(colPos, 'row');
      const mapColTop = this._getColTop(bottomPosition.col, bottomPosition.row);
      colsDistance.push(mapColTop.row - bottomPosition.row);
    });
    const moveSteps = _.min(colsDistance);
    const {row} = this._activeBlockPosition;
    this._activeBlockPosition.row = row + moveSteps;
    this._updateActiveBlockPosition();
    return {
      x: minLeft * this._cellWidth,
      y: minTop * this._cellWidth,
      width: width * this._cellWidth,
      height: moveSteps * this._cellWidth
    };
  }

  public blockToMap(blockInfo: IBlockInfo = this.activeBlock.getBlockInfo(), blockPosition: IMapPosition = this._activeBlockPosition): IMapPosition[] {
    const outRangeCellPos: IMapPosition[] = [];
    const blockCellsMapPosition = this._activeBlockToMapPostion(blockPosition);
    _.forEach(blockCellsMapPosition, (pos) => {
      if (this.isInRange(pos)) {
        this.setMap(pos, 1);
      } else {
        outRangeCellPos.push(pos);
      }
    });
    return outRangeCellPos;
  }

  public isInRange(mapPosition: IMapPosition): boolean {
    const {col, row} = mapPosition;
    if (col >= 0 && col <= this._colsCount - 1 && row >= 0 && row <= this._rowsCount - 1) {
      return true;
    }
    return false;
  }

  public getFullRow(): number[] {
    let fullRowIndex: number[] = [];
    for (let row = this._rowsCount - 1; row >= 0; row--) {
      let mapCol = this._map[row];
      if (_.includes(mapCol, 0)) {
        continue;
      }
      fullRowIndex.push(row);
    }
    return fullRowIndex;
  }
  public resetRow(rows: number[]) {
    const emptyRow: number[] = new Array(this._colsCount);
    _.fill(emptyRow, 0);
    let fullRowIndex: number[] = [];
    _.forEach(rows, (row) => {
      this._map[row] = emptyRow.concat();
    });
    this._updateMapView();
  }

  public clearRow(rows: number[]) {
    _.pullAt(this._map, rows);
    const emptyRow: number[] = new Array(this._colsCount);
    _.fill(emptyRow, 0);
    _.times(rows.length, () => {
      this._map.unshift(emptyRow.concat());
    });
    this._updateMapView();
  }

  public clear() {
    this._initMap();
    this._updateMapView();
    this.activeBlock.blockType = Block.randomType();
    this.activeBlock.blockRotation = Block.randomRotation();
    this._initActiveBlockPosition();
    this._updateActiveBlockPosition();
  }

  public getActiveBlockInfo(): IBlockInfo {
    return this.activeBlock.getBlockInfo();
  }

  public getActiveBlockCenterPos() {
    const posArr = this._activeBlockToMapPostion();
    const maxCol = _.maxBy(posArr, 'col').col;
    const minCol = _.minBy(posArr, 'col').col;
    const maxRow = _.maxBy(posArr, 'row').row;
    const minRow = _.minBy(posArr, 'row').row;
    const x = ((maxCol - minCol + 1) / 2 + minCol) * this._cellWidth;
    const y = ((maxRow - minRow + 1) / 2 + minRow) * this._cellWidth;
    return {x, y};
  }

  get map(): number[][] {
    return this._map;
  }
  set map(map: number[][]) {
    this._map = map;
    this._updateMapView();
  }

  get activeBlockRotation() {
    return this.activeBlock.blockRotation;
  }
  set activeBlockRotation(blockRotation: number) {
    let canMove = false;
    let blockPosition = this._activeBlockPosition;
    const {col, row} = blockPosition;
    let blockPositionSteps = [blockPosition];
    let newBlockPosition: IMapPosition;
    blockPositionSteps.push(_.assign({}, blockPosition, {row: row - 1}) as IMapPosition);
    blockPositionSteps.push(_.assign({}, blockPosition, {col: col - 1}) as IMapPosition);
    blockPositionSteps.push(_.assign({}, blockPosition, {col: col + 1}) as IMapPosition);
    blockPositionSteps.push(_.assign({}, blockPosition, {row: row - 2}) as IMapPosition);
    blockPositionSteps.push(_.assign({}, blockPosition, {col: col - 2}) as IMapPosition);
    blockPositionSteps.push(_.assign({}, blockPosition, {col: col + 2}) as IMapPosition);
    _.forEach(blockPositionSteps, (pos) => {
      if (canMove = this._canMoveTo(pos, blockRotation)) {
        newBlockPosition = pos;
        return false;
      }
    });
    if (!canMove) {
      return;
    }
    this.activeBlock.blockRotation = blockRotation;
    this._activeBlockPosition = newBlockPosition;
    this._updateActiveBlockPosition();
  }

  private _init(): void {
    this._initBg();
    this._initMap();
    this._initCells();
    this._initActiveBlock();
    this._updateMapView();
  }

  private _initActiveBlock() {
    this.activeBlock = new Block(this._cellWidth);
    this.activeBlock.mask = this._bg;
    this._initActiveBlockPosition();
    this._updateActiveBlockPosition();
    this.addChild(this.activeBlock);
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
        cell.static();
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
          : 1;
      });
    });
  }

  private _initActiveBlockPosition(): void {
    this._activeBlockPosition = {col: 0, row: 0};
    const blockMapPosition = this._activeBlockToMapPostion();
    const minCol = _.minBy(blockMapPosition, 'col').col;
    const maxCol = _.maxBy(blockMapPosition, 'col').col;
    const maxRow = _.maxBy(blockMapPosition, 'row').row;
    const col = Math.ceil((this._colsCount - (maxCol - minCol + 1)) / 2) - minCol;
    const row = -(maxRow + 1);
    this._activeBlockPosition = {col, row};
    this._updateActiveBlockPosition();
  }

  private _updateActiveBlockPosition(): void {
    const {col, row} = this._activeBlockPosition;
    const x = col * this._cellWidth;
    const y = row * this._cellWidth;
    this.activeBlock.x = x;
    this.activeBlock.y = y;
  }

  private _activeBlockToMapPostion(position = this._activeBlockPosition, rotationShape = this.activeBlock.getRotationShape()): IMapPosition[] {
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
    const canMove = this._canMoveTo(newPosition);
    return {canMove, newPosition};
  }
  private _canMoveTo(position: IMapPosition, blockRotation: number = this.activeBlock.blockRotation): boolean {
    let canMove = true;
    const blockMapPosition = this._activeBlockToMapPostion(position, this.activeBlock.getRotationShape(blockRotation));
    _.forEach(blockMapPosition, (mapPos) => {
      const {col, row} = mapPos;
      if (_.get(this.map, `[${row}][${col}]`) === 1 || col < 0 || col > this._colsCount - 1 || row > this._rowsCount - 1) {
        canMove = false;
        return false;
      }
    });
    return canMove;
  }

  private _getColTop(col: number, fromRow: number = 0): IMapPosition {
    let ret = {col, row: this._rowsCount - 1};
    _.forEach(this._map, (colCells, row) => {
      if (row < fromRow) {
        return;
      }
      if (colCells[col] === 1) {
        ret.row = row - 1;
        return false;
      }
    });
    return ret;
  }
}
