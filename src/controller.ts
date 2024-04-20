// controller.ts

import { Direction, Input, Key } from "./basetypes.js"
import { Board } from "./model.js"
import { View } from "./view.js"

export class Controller {
  board: Board;
  view: View;
  input: Input;
  stopCallback?: () => void;

  constructor(board: Board, view: View, input: Input) {
    this.board = board;
    this.view = view;
    this.input = input;
  }

  start(stop: () => void) {
    this.stopCallback = stop;
    this.input.onKey(this.handleKey.bind(this));
    this.view.start();
  }

  private handleKey(key: Key) {
    let showCursor = true;

    switch (key) {
      case Key.Up: this.board.moveCursor(Direction.Up); break;
      case Key.Right: this.board.moveCursor(Direction.Right); break;
      case Key.Down: this.board.moveCursor(Direction.Down); break;
      case Key.Left: this.board.moveCursor(Direction.Left); break;

      case Key.Space:
        this.board.toggleMark();
        break;

      case Key.Enter:
        this.board.advance();
        showCursor = false;
        break;

      case Key.Quit:
        this.stop();
        return;
    }

    this.view.showCursor(showCursor);
  }

  private stop() {
    this.view.stop();
    this.stopCallback!();
    this.stopCallback = undefined;
  }
}
