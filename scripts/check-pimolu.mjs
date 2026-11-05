import fs from "node:fs";
import ts from "typescript";

// Count authored UI nodes once, including the internals of local components.
// Local component invocations are excluded to avoid counting their internals twice.
// Next.js document scaffolding (html/body) is outside the storefront scope.
const filename = new URL("../app/storefront.tsx", import.meta.url);
const source = ts.createSourceFile(
  "storefront.tsx",
  fs.readFileSync(filename, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const imports = new Set();
const counts = { pimolu: 0, native: 0 };
source.forEachChild((node) => {
  if (
    ts.isImportDeclaration(node) &&
    node.moduleSpecifier.text === "@pimolu/react"
  ) {
    node.importClause.namedBindings.elements.forEach((item) =>
      imports.add(item.name.text),
    );
  }
});
function visit(node) {
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
    const name = node.tagName.getText(source);
    if (imports.has(name)) counts.pimolu++;
    else if (/^[a-z]/.test(name)) counts.native++;
  }
  ts.forEachChild(node, visit);
}
visit(source);
const percentage = (counts.pimolu / (counts.pimolu + counts.native)) * 100;
console.log(
  `${counts.pimolu} Pimolu UI / ${counts.pimolu + counts.native} authored UI nodes = ${percentage.toFixed(1)}%`,
);
if (percentage < 90) {
  console.error("Pimolu UI usage must stay at or above 90%.");
  process.exitCode = 1;
}
