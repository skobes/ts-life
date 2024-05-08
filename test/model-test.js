import { Board } from "../dist/model.js";
import assert from "assert/strict";
import test from "node:test";

// TODO: more tests

test("toggle state", t => {
  const b = new Board();
  const p = {x: 0, y: 0};
  assert.equal(false, b.getStateAt(p));

  b.toggleMark();
  assert.equal(true, b.getStateAt(p));

  b.toggleMark();
  assert.equal(false, b.getStateAt(p));
});
