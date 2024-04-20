// basetypes.ts

export type Point = {
  x: number,
  y: number
}

export type Size = {
  width: number,
  height: number
}

export enum Direction {
  Up, Right, Down, Left
}

export enum Color {
  Black, Blue, Yellow, White
}

export enum Key {
  Up = 1, Right, Down, Left, Space, Enter, Quit
}

export interface Input {
  onKey(handler: (key: Key) => void): void;
}

export interface Output {
  setUp(): void;
  tearDown(): void;
  setPixel(x: number, y: number, topColor: Color, bottomColor: Color): void;
  getSize(): Size;
  onResize(handler: (size: Size) => void): void;
  print(s: string, x: number, y: number): void;
}
