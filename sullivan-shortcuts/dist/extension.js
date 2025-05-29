"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
function activate(context) {
  const disposable = vscode.commands.registerCommand("formatPaste.run", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection).trim();
    if (!selectedText) {
      vscode.window.showErrorMessage("Select an example line to infer formatting.");
      return;
    }
    const quote = selectedText.includes("'") ? "'" : '"';
    const hasComma = selectedText.endsWith(",");
    const clipboard = await vscode.env.clipboard.readText();
    if (!clipboard.trim()) {
      vscode.window.showErrorMessage("Clipboard is empty.");
      return;
    }
    const lines = clipboard.trim().split(/\r?\n/).map((line) => `${quote}${line.trim()}${quote}${hasComma ? "," : ""}`);
    const insertPos = editor.document.lineAt(selection.end.line).range.end;
    await editor.edit((editBuilder) => {
      editBuilder.insert(insertPos, "\n" + lines.join("\n"));
    });
  });
  context.subscriptions.push(disposable);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=extension.js.map
