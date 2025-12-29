export function render(element: any, container: HTMLElement) {
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

  element.props.children.forEach((child: any) => render(child, dom));
  container.appendChild(dom);
}
