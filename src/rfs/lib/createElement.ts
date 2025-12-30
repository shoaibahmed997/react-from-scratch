import { Props } from "../types";

export function createElement(type: string, props: Props, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createDom(fiber: any) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key: any) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((property) => {
      dom[property] = fiber.props[property];
    });

  return dom;
}
