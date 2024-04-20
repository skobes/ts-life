import { Board } from "../dist/model.js";
import assert from "assert/strict";

// TODO: more tests

describe("Board", function () {
  describe("#toggleMark()", function () {
    it("should toggle state", function () {
      const b = new Board();
      const p = {x: 0, y: 0};
      assert.equal(false, b.getStateAt(p));

      b.toggleMark();
      assert.equal(true, b.getStateAt(p));

      b.toggleMark();
      assert.equal(false, b.getStateAt(p));
    });
  });
});
