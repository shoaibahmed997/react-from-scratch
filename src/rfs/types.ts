export type Props = {
  children?: Array<unknown>;
  [key: string]: unknown;
};

export type Element = {
  type: string;
  props: Props;
};
