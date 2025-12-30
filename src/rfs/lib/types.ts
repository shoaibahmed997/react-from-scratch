export type Props = {
  children?: Array<Element>;
  [key: string]: unknown;
};

export type ElementType = string | ((props: Props) => Element);

export type Element = {
  type: ElementType;
  props: Props;
};

export type Fiber = {
  type: ElementType;
  props: Props;
  dom: HTMLElement | Text | null;
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
};
