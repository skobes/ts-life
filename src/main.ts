// main.ts

import { Game } from "./game.js";
import { Terminal } from "./terminal.js";

async function main() {
  const term = new Terminal();

  const game = new Game(term, term);
  await game.run();

  term.dispose();
}

main();
