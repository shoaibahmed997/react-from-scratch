import { createDom } from "./dom";
import { Fiber, Element, Props } from "./types";
import { deletions, setWipFiber } from "./render";

// performs a single fiber. so far by my understanding it creates a dom for a fiber. and select the next fiber for work
// the way it selects is  traverse to child -> when child finishes -> work upwards and create dom for siblings -> keep going up until the root node.
export function performUnitOfWork({ fiber }: { fiber: Fiber }): Fiber | null {
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent({ fiber });
  } else {
    updateHostComponent({ fiber });
  }

  if (fiber.child) return fiber.child;

  reconcileChildren({
    wipFiber: fiber,
    elements: fiber.props.children || [],
  });
  if (fiber.child) return fiber.child;

  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    return nextFiber.parent;
  }

  return null;
}

function updateFunctionComponent({ fiber }: { fiber: Fiber }): void {
  setWipFiber({ newWipFiber: fiber });
  // resetwipfiberhooks

  const children = [(fiber.type as (props: Props) => Element)(fiber.props)];

  reconcileChildren({
    wipFiber: fiber,
    elements: children,
  });
}

function updateHostComponent({ fiber }: { fiber: Fiber }): void {
  if (!fiber.dom) {
    fiber.dom = createDom({ fiber });
  }

  reconcileChildren({
    wipFiber: fiber,
    elements: fiber.props.children || [],
  });
}

export function reconcileChildren({
  wipFiber, // current fiber
  elements, // its children fiber.props.children
}: {
  wipFiber: Fiber;
  elements: Array<Element>;
}): void {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child || null; // points to the first child of previous version of fiber
  let prevSibling: Fiber | null = null; // used to link new siblings in fiber tree.

  // this loop parallely checks the new fiber's children with old children and decides if we need to update, add or delete the fibers
  // The goal of reconcileChildren is to compare the new set of children (elements) with the previous set (fibers) and build a new fiber tree that represents the next state of the UI. This process is called "reconciliation" or "diffing."
  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];

    let newFiber: Fiber | null = null;

    const isSametype = oldFiber && element && element.type === oldFiber.type;

    // what is the difference between the oldFiber and wipFiber? oldFiber is previous set(version) child of wipFiber and element is the new child of wipFiber

    // if the oldFiber exists and oldfiber type is same as the element type
    // what is element? element here is the child of Root fiber for first iteration of performUnitOfWork
    // and in general element is the child of the wipFiber.

    /**
     * let's say we have this tree
     * <div> -> this is root and it has two children h1 and div. for first iteration the element will be {type:h1,props:{}}
     *  <h1>hello world</h1>
     *  <div>
     *    <h2>ahoy world</h2>
     *  </div>
     * </div>
     */
    if (isSametype && oldFiber) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    if (element && !isSametype) {
      // its a new element
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null, // new element can't reuse the dom
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: null, // no alternate since it's new
        effectTag: "PLACEMENT", // -> i don't know what this is but as per my understanding this will be used later when doms are appended to the html
      };
    }

    if (oldFiber && !isSametype) {
      // this must be the node deletion. we had h1 and now it's h3 that means the elemnt changed so we need to delete the previous one
      // delete the oldFiber.
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // in the loop we are changing the old fiber to it's sibling here so in the next iteration it will
    // oldfiber will point to the next sibling of wipfiber.children (previous one )
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element && prevSibling) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber; // we are setting this for the next loop iteration.
    index++;
  }
}
