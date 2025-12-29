export type CreateElement = {
  type: string;
  props: any;
};

export type Render = (element: any, container: HTMLElement) => void;
