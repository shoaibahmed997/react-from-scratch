import RFS from "./lib";

const element = RFS.createElement(
  "div",
  { id: "foo" },
  RFS.createElement("a", {}, "bar"),
  RFS.createElement("b", {})
);

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");
RFS.render(element, container);
