import { createDom } from "./dom";
import { Element, Fiber } from "./types";

/** 
module-scoped singletonsone shared instance per loaded module (per module realm). Any import that reads/changes them sees the same mutable value (they are live bindings).
Mutable and shared across the app where the module is loaded, so they behave like shared global state for that module.
*/
export let wipRoot: Fiber | null = null;
export let nextUnitOfWork: Fiber | null = null;
export let wipFiber: Fiber | null = null;
const FRAME_LENGTH: number = 5;
export function render({
  element,
  container,
}: {
  element: Element;
  container: HTMLElement;
}): void {
  // @shoaibahmed997 in the start we need to setup the initial fiber tree.

  wipRoot = {
    type: "ROOT",
    parent: null, // -> since this is the root node
    props: {
      children: [element],
    },
    dom: container,
    sibling: null, // -> root node can't have siblings
    child: null, // -> but why ??? maybe child is used for something else ?
  };

  nextUnitOfWork = wipRoot;
  scheduleNextIteration();
}

function scheduleNextIteration(): void {
  // it calls the workLoop function

  const timeoutId = setTimeout(() => {
    workLoop(performance.now());
  }, FRAME_LENGTH);

  requestAnimationFrame((rafTime) => {
    clearTimeout(timeoutId), workLoop(rafTime);
  });

  // TODO: try out this method later on.
  // requestIdleCallback(workLoop)
}

let isWorking = false;

function workLoop(currentTime = performance.now()): void {
  if (isWorking) return;
  isWorking = true;

  const deadline = currentTime + FRAME_LENGTH;

  try {
    while (nextUnitOfWork && performance.now() < deadline) {
      nextUnitOfWork = performUnitOfWork({ fiber: nextUnitOfWork });
    }

    if (!nextUnitOfWork) {
      commitRoot();
    }
  } finally {
    isWorking = false;
  }

  //TODO: why are we scheduling work here ?
  scheduleNextIteration();
}

// performs a single fiber. so far by my understanding it creates a dom for a fiber. and select the next fiber for work
// the way it selects is  traverse to child -> when child finishes -> work upwards and create dom for siblings -> keep going up until the root node.
function performUnitOfWork({ fiber }: { fiber: Fiber }): Fiber | null {
  if (!fiber.dom) {
    fiber.dom = createDom({ fiber });
  }
  if (fiber.child) return fiber.child;

  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    return nextFiber.parent;
  }

  return null;
}

function commitRoot(): void {}
