let nextUnitOfWork = null;
export function render(element: any, container: HTMLElement) {
  // const children = element.props?.children;
  // if (Array.isArray(children)) {
  //   children.forEach((child: any) => render(child, dom));
  // } else if (children != null) {
  //   render(children, dom);
  // }
  // container.appendChild(dom);

  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}
