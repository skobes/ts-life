// model.ts

import { Point, Size, Direction } from "./basetypes.js";
import * as util from "./util.js"

function computeNewState(prev: boolean, neighbors: number): boolean {
  if (prev && (neighbors < 2 || neighbors > 3))
    return false;

  if (!prev && neighbors == 3)
    return true;

  return prev;
}

export class Board {
  state: Map<string, boolean>;
  size: Size;
  cursor: Point;
  observers: Set<BoardObserver>;

  constructor() {
    this.state = new Map();
    this.size = { width: 1, height: 1 };
    this.cursor = { x: 0, y: 0 };
    this.observers = new Set();
  }

  getCursor() {
    return this.cursor;
  }

  getStateAt(point: Point): boolean {
    return this.state.get(mapKeyForPoint(point)) || false;
  }

  addObserver(observer: BoardObserver) {
    this.observers.add(observer);
  }

  removeObserver(observer: BoardObserver) {
    this.observers.delete(observer);
  }

  resize(size: Size) {
    this.clearStateRange(size.width, this.size.width, 0, this.size.height);
    this.clearStateRange(0, this.size.width, size.height, this.size.height);
    this.size = size;
    this.setCursorInternal(this.cursor);
  }

  moveCursor(direction: Direction) {
    let p = { ...this.cursor };
    switch (direction) {
      case Direction.Up: p.y--; break;
      case Direction.Right: p.x++; break;
      case Direction.Down: p.y++; break;
      case Direction.Left: p.x--; break;
    }
    this.setCursorInternal(p);
  }

  toggleMark() {
    this.flip(this.cursor);
  }

  advance() {
    const flips = [];
    for (const p of util.genCoords(0, 0, this.size.width, this.size.height)) {
      const current = this.getStateAt(p);
      const newState = computeNewState(current, this.countNeighbors(p));
      if (current != newState)
        flips.push(p);
    }
    for (const f of flips)
      this.flip(f);
  }

  private flip(p: Point) {
    const k = mapKeyForPoint(p);
    const current = this.state.get(k) || false;
    const newState = !current;
    this.state.set(k, newState);
    this.notifyCellChanged(p, newState);
  }

  private countNeighbors(p: Point) {
    let count = 0;
    for (const n of util.genCoords(p.x - 1, p.y - 1, p.x + 2, p.y + 2)) {
      if (!util.pointsEqual(n, p) && this.getStateAt(n))
        count++;
    }
    return count;
  }

  private clearStateRange(x1: number, x2: number, y1: number, y2: number) {
    for (const p of util.genCoords(x1, y1, x2, y2))
      this.state.delete(mapKeyForPoint(p));
  }

  private setCursorInternal(point: Point) {
    const oldPoint = this.cursor;
    const newPoint = {
      x: util.clamp(point.x, 0, this.size.width - 1),
      y: util.clamp(point.y, 0, this.size.height - 1)
    };
    if (!util.pointsEqual(oldPoint, newPoint)) {
      this.cursor = newPoint;
      this.notifyCursorMoved(oldPoint, newPoint);
    }
  }

  private notifyCursorMoved(oldCursor: Point, newCursor: Point): void {
    for (const o of this.observers)
      o.cursorMoved(oldCursor, newCursor);
  }

  private notifyCellChanged(cell: Point, state: boolean): void {
    for (const o of this.observers)
      o.cellChanged(cell, state);
  }
}

export interface BoardObserver {
  cellChanged(point: Point, state: boolean): void;
  cursorMoved(oldCursor: Point, newCursor: Point): void;
}

function mapKeyForPoint(p: Point): string {
  return `${p.x},${p.y}`;
}
