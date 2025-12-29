import RFS from "./lib";
import ReactApp from "./ReactApp";
const heading = RFS.createElement("h1", {}, "Ahoy World");

const element = RFS.createElement("div", { id: "foo" }, heading);

console.log("react app", ReactApp());

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");
RFS.render(ReactApp(), container);
