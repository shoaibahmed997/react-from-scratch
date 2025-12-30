import { Fiber } from "../types";
import { createDom } from "./createElement";

let nextUnitofWork: any = null;

function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children || [];
  let index = 0;
  let prevSibling = null;

  while (index < elements?.length) {
    const element = elements[index];

    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      dom: null,
      parent: fiber,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // @ts-expect-error shut up for now please
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  // TODO return next unit of work
}

export function workLoop(deadline: IdleDeadline) {
  let shouldYeild = false;
  while (nextUnitofWork && !shouldYeild) {
    nextUnitofWork = performUnitOfWork(nextUnitofWork);
    shouldYeild = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
