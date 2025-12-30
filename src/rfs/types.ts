export type Props = {
  children?: Array<Element>;
  [key: string]: unknown;
};

export type Element = {
  type: string;
  props: Props;
};

export type Fiber = {
  type: string;
  props: Props;
  dom: HTMLElement | null;
  parent: Fiber;
  child?: Fiber;
  sibling?: Fiber;
};
