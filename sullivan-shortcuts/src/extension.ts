import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
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

    const lines = clipboard
      .trim()
      .split(/\r?\n/)
      .map((line) => `${quote}${line.trim()}${quote}${hasComma ? "," : ""}`);

    const insertPos = editor.document.lineAt(selection.end.line).range.end;

    await editor.edit((editBuilder) => {
      editBuilder.insert(insertPos, "\n" + lines.join("\n"));
    });
  });

  context.subscriptions.push(disposable);
}
