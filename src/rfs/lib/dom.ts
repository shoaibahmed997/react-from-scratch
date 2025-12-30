import { createTextElement } from "./createElement";
import { Fiber } from "./types";

export function createDom({ fiber }: { fiber: Fiber }): HTMLElement | Text {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type as string);

  // attach the props to
  const isProperty = (key: string) => key !== "children";

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((key) => {
      if (dom instanceof HTMLElement) {
        dom.setAttribute(key, String(fiber.props[key]));
      }
    });

  return dom;
}
