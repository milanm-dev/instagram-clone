import { Text } from "slate";
import escapeHtml from "escape-html";

const serailize = (node) => {
  if (Text.isText(node)) {
    return escapeHtml(node.text);
  }

  const children = node.children.map((n) => serailize(n)).join("");
  switch (node.type) {
    case "paragraph":
      return `${children}<br>`;

    default:
      return children;
  }
};

export default serailize;
