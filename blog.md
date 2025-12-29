# React From Scratch.

the prime motivation for this project is for me to understand how react works under the hood.

# React Component Lifecycle

1. Mounting
2. Updating
3. Unmounting

## Mounting

in simplest words -> When a React component is being inserted into the DOM.

## Updating

When a React component is being re-rendered as a result of changes to either its props or state.

## Unmounting

When a React component is being removed from the DOM.

# Objective:

for this practice project, I will create a simple To-Do App using React From Scratch (RFS) library that I will build from the ground up.

# Getting Started

- Create a new directory for your project and navigate into it.
- Initialize a new Node.js project using pnpm init.
- add vite, @react and react-dom as dependencies. and their types as dev dependencies.
- we will create a simple index.html file to serve our app. it is the starting point of our application.

## let's reverse engineer some of the core functionalities of React.

## createElement function

The createElement function is responsible for creating a virtual representation of a DOM element. It takes in the type of element, its properties (props), and its children, and returns an object that represents the element.

```
const reactElement = React.createElement(
  "div",
  { id: "container" },
  "Ahoy from React!"
);
console.log("React createElement:", reactElement);
```

the output of the above code will be:

img here

the react does a ton of things internally but i am going to keep it stupid simple for now.

let's create our own create element function in the rfs/createElement.js file.

it takes the tagName, the props and the children as arguments and returns an object representing the element.

```
export function createElement(type: string, props: any, ...children: any[]) {
  return {
    type,
    props: { ...props, children },
  };
}
```

let's try to compare the output of our createElement function with react's createElement function.

```
const myElement = createElement(
"div",
{ id: "container" },
"Ahoy from React from Scratch!"
);


const reactElement = React.createElement(
"div",
{ id: "container" },
"Ahoy from React!"
);

console.log("Custom createElement:", myElement);
console.log("React createElement:", reactElement);

```

not bad for now. let's create simple react app with react's createElement and render api.

```

const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
);

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");
createRoot(container).render(element);
```

now it's time to use our own createElement function and re-create the same.

```
const element = createElement(
  "div",
  { id: "foo" },
  createElement("a", {}, "bar"),
  createElement("b", {})
);

```

we replaced the React.createElement with our own createElement function but this will not work with react's render method.

## Render function

let's study how render function works under the hood first and then we will try to implement our own simple version of it.

okay i tried going into the react library but it's just too much there and not able to find what i wanted. @REMINDMETODOTHISLATER

let's start with the render function. we create nodes with createElement and we need to append them to dom. ( atleast in the most basic version of it. )
