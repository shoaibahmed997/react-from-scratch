import { Element, Props } from "./types";
export function createElement({
  type,
  props,
  children,
}: {
  type: string;
  props: Props;
  children: Array<Element | string | number>;
}): Element {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object"
          ? child
          : createTextElement({ text: String(child) })
      ),
    },
  };
}

export function createTextElement({ text }: { text: string }): Element {
  return {
    type: "TEXT_ELEMENT",
    props: {
      value: text,
      children: [],
    },
  };
}
