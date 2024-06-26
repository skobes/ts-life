// terminal.ts

import { Color, Key, Size } from "./basetypes.js"

import { default as blessed, BlessedProgram, colors } from "blessed"
import { Key as PlatformKey } from "readline"

const UPPER_HALF_BLOCK = "\u2580";
const LOWER_HALF_BLOCK = "\u2584";
const DEFAULT_BG = "black";
const KEYSEQ_CTRL_C = "\x03";

export class Terminal {
  program: BlessedProgram;
  keyHandler?: (key: Key) => void;
  resizeHandler?: (size: Size) => void;
  size: Size;

  constructor() {
    const p = blessed.program();
    this.program = p;
    this.size = { width: p.cols, height: p.rows };

    p.on("keypress", this.handleKeyPress.bind(this));
    p.on("resize", this.handleResize.bind(this));
  }

  dispose() {
    this.program.destroy();
  }

  onKey(handler: (key: Key) => void) {
    this.keyHandler = handler;
  }

  getSize() {
    return this.size;
  }

  onResize(handler: (size: Size) => void) {
    this.resizeHandler = handler;
  }

  setPixel(x: number, y: number, topColor: Color, bottomColor: Color) {
    const tc = colorStr(topColor);
    const bc = colorStr(bottomColor);

    if (tc == DEFAULT_BG)
      this.printHelper(x, y, tc, bc, LOWER_HALF_BLOCK);
    else
      this.printHelper(x, y, bc, tc, UPPER_HALF_BLOCK);
  }

  print(s: string, x: number, y: number) {
    this.printHelper(x, y, colorStr(Color.Black), colorStr(Color.White), s);
  }

  setUp() {
    const p = this.program;
    p.alternateBuffer();
    p.hideCursor();
    p.clear();
  }

  tearDown() {
    const p = this.program;
    p.clear();
    p.showCursor();
    p.normalBuffer();
  }

  private printHelper(x: number, y: number,
                      bg: string, fg: string, s: string) {
    const p = this.program;
    p.move(x, y);
    p.bg(bg);
    p.fg(fg);
    p.write(s);
  }

  private handleKeyPress(_ch: string, key: PlatformKey) {
    if (key.sequence == KEYSEQ_CTRL_C) {
      this.abort();
      return;
    }
    if (!this.keyHandler || !key.name)
      return;
    const k = KEY_MAP.get(key.name);
    if (k)
      this.keyHandler(k);
  }

  private handleResize() {
    const p = this.program;
    const s = { width: p.cols, height: p.rows };
    this.size = s;
    if (this.resizeHandler)
      this.resizeHandler(s);
  }

  private abort() {
    this.tearDown();
    console.log("^C");
    process.exit(0);
  }
}

const KEY_MAP = new Map<string, Key>([
  ["up", Key.Up],
  ["right", Key.Right],
  ["down", Key.Down],
  ["left", Key.Left],
  ["space", Key.Space],
  ["enter", Key.Enter],
  ["q", Key.Quit]
]);

const COLOR_MAP = new Map<Color, string>([
  [Color.Black, "black"],
  [Color.Blue, "blue"],
  [Color.Yellow, "yellow"],
  [Color.White, "white"]
]);

function colorStr(c: Color): string {
  return COLOR_MAP.get(c) || DEFAULT_BG;
}
