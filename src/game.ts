// game.ts

import { Input, Output } from "./basetypes.js"

import { Board } from "./model.js"
import { View } from "./view.js"
import { Controller } from "./controller.js"

export class Game {
  board: Board;
  view: View;
  controller: Controller;

  constructor(input: Input, output: Output) {
    this.board = new Board();
    this.view = new View(this.board, output);
    this.controller = new Controller(this.board, this.view, input);
  }

  async run() {
    return new Promise(resolve => {
      this.controller.start(() => { resolve(true); });
    });
  }
}
