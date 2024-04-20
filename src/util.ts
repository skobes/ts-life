// util.ts

import { Point } from "./basetypes.js";

export function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x == p2.x && p1.y == p2.y;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function* genCoords(x1: number, y1: number,
                           x2: number, y2: number): IterableIterator<Point> {
  if (x1 >= x2 || y1 >= y2)
    return;

  for (let y = y1; y < y2; y++)
    for (let x = x1; x < x2; x++)
      yield {x, y};
}
