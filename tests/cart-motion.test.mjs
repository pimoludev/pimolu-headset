import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../app/cart-motion.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});
const { prepareCartEntrance } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

function setup(reducedMotion = false) {
  let nextId = 1;
  const pending = new Map();
  const focusCalls = [];
  const panel = {
    inert: false,
    isConnected: true,
    dataset: {},
    focus: (options) => focusCalls.push(options),
  };
  const scheduler = {
    requestFrame(callback) {
      const id = nextId++;
      pending.set(id, callback);
      return id;
    },
    cancelFrame: (id) => pending.delete(id),
  };
  const cleanup = prepareCartEntrance(panel, reducedMotion, scheduler);
  function frame() {
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach((callback) => callback(0));
  }
  return { panel, pending, focusCalls, cleanup, frame };
}

test("opening settles for a painted frame before revealing and focusing without scroll", () => {
  const { panel, focusCalls, cleanup, frame } = setup();
  assert.equal(panel.inert, true);
  assert.equal(panel.dataset.motionReady, undefined);
  frame();
  assert.equal(panel.inert, true);
  assert.equal(panel.dataset.motionReady, undefined);
  assert.equal(focusCalls.length, 0);
  frame();
  assert.equal(panel.inert, false);
  assert.equal(panel.dataset.motionReady, "true");
  assert.deepEqual(focusCalls, [{ preventScroll: true }]);
  cleanup();
});

test("closing during preparation cancels the reveal and does not steal focus", () => {
  const { panel, pending, focusCalls, cleanup, frame } = setup();
  frame();
  cleanup();
  frame();
  assert.equal(pending.size, 0);
  assert.equal(panel.inert, false);
  assert.equal(panel.dataset.motionReady, undefined);
  assert.equal(focusCalls.length, 0);
});

test("reduced motion reveals at the next frame without the extra animation frame", () => {
  const { panel, pending, focusCalls, cleanup, frame } = setup(true);
  frame();
  assert.equal(panel.dataset.motionReady, "true");
  assert.equal(panel.inert, false);
  assert.equal(pending.size, 0);
  assert.deepEqual(focusCalls, [{ preventScroll: true }]);
  cleanup();
});

test("cleanup resets the entrance so every subsequent opening can animate", () => {
  const { panel, pending, cleanup, frame } = setup();
  frame();
  frame();
  cleanup();
  assert.equal(panel.dataset.motionReady, undefined);
  assert.equal(panel.inert, false);
  assert.equal(pending.size, 0);
});
