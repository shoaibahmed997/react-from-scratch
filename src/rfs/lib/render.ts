let nextUnitOfWork = null;
export function render(element: any, container: HTMLElement) {
  // const children = element.props?.children;
  // if (Array.isArray(children)) {
  //   children.forEach((child: any) => render(child, dom));
  // } else if (children != null) {
  //   render(children, dom);
  // }
  // container.appendChild(dom);

  let wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}
