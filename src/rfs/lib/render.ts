export function render(element: any, container: HTMLElement) {
  if (typeof element === "string" || typeof element === "number") {
    container.appendChild(document.createTextNode(String(element)));
    return;
  }
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // @ts-expect-error just ignore for now.
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((property) => {
      dom[property] = element.props[property];
    });

  const children = element.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child: any) => render(child, dom));
  } else if (children != null) {
    render(children, dom);
  }

  container.appendChild(dom);
}
