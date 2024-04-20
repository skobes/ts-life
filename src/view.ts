// view.ts

import { Color, Output, Point, Size } from "./basetypes.js";
import { Board } from "./model.js"
import * as util from "./util.js"

const INSTRUCTIONS = "← ↑ ↓ →  space:mark  enter:advance  q:quit";

export class View {
  board: Board;
  output: Output;
  cursorShown: boolean;

  constructor(board: Board, output: Output) {
    this.board = board;
    this.output = output;
    this.cursorShown = true;
    this.observe(board);
  }

  start() {
    const o = this.output;
    o.setUp();
    this.handleResize(o.getSize());
    o.onResize(this.handleResize.bind(this));
    this.renderCursor();
  }

  stop() {
    this.output.tearDown();
  }

  showCursor(show: boolean) {
    if (this.cursorShown == show)
      return;

    this.cursorShown = show;
    this.renderCursor();
  }

  private renderCursor() {
    this.renderPixel(cellToPixel(this.board.getCursor()));
  }

  private observe(board: Board) {
    board.addObserver({
      cellChanged: (point, _state) => {
        this.renderPixel(cellToPixel(point));
      },
      cursorMoved: (oldCursor, newCursor) => {
        this.renderPixel(cellToPixel(oldCursor));
        this.renderPixel(cellToPixel(newCursor));
      }
    });
  }

  private handleResize(size: Size) {
    this.board.resize(outSizeToBoardSize(size));
    for (const p of util.genCoords(0, 0, size.width, size.height))
      this.renderPixel(p);
    this.output.print(INSTRUCTIONS, 0, size.height - 1);
  }

  private renderPixel(p: Point): void {
    const topColor = this.pixelTopColor(p);
    const bottomColor = this.pixelBottomColor(p);
    this.output.setPixel(p.x, p.y, topColor, bottomColor);
  }

  private pixelTopColor(pixel: Point): Color {
    const topCell = { x: pixel.x, y: pixel.y * 2};
    return this.cellColor(topCell);
  }

  private pixelBottomColor(pixel: Point): Color {
    const bottomCell = { x: pixel.x, y: pixel.y * 2 + 1};
    return this.cellColor(bottomCell);
  }

  private cellColor(cell: Point): Color {
    const state = this.board.getStateAt(cell);
    const isCursor = util.pointsEqual(cell, this.board.getCursor());

    if (isCursor && this.cursorShown)
      return state ? Color.Yellow : Color.Blue;
    else
      return state ? Color.White : Color.Black;
  }
}

function outSizeToBoardSize(size: Size): Size {
  return {
    width: size.width,
    height: (size.height - 1) * 2
  };
}

function cellToPixel(cell: Point): Point {
  return { x: cell.x, y: Math.floor(cell.y / 2) };
}
