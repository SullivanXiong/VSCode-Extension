import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("formatPaste.run", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText.trim()) {
      vscode.window.showErrorMessage("Select an example line to infer formatting.");
      return;
    }

    // Read clipboard text
    const clipboard = await vscode.env.clipboard.readText();
    if (!clipboard.trim()) {
      vscode.window.showErrorMessage("Clipboard is empty.");
      return;
    }

    const trimmed = selectedText.trim();
    const indent = selectedText.match(/^(\s*)/)?.[1] ?? "";

    // Match prefix + main text + suffix
    const formatMatch = trimmed.match(/^([^a-zA-Z0-9]*)(.*?)([^a-zA-Z0-9]*)$/);
    const prefix = formatMatch?.[1] ?? "";
    const main = formatMatch?.[2] ?? "";
    const suffix = formatMatch?.[3] ?? "";

    const lines = clipboard
      .trim()
      .split(/\r?\n/)
      .map((line) => `${indent}${prefix}${preserveCase(main, line.trim())}${suffix}`);

    const insertPos = editor.document.lineAt(selection.end.line).range.end;

    await editor.edit((editBuilder) => {
      editBuilder.insert(insertPos, "\n" + lines.join("\n"));
    });
  });

  context.subscriptions.push(disposable);
}

// Capitalization matching
function preserveCase(example: string, text: string): string {
  if (!example) return text;
  if (example === example.toUpperCase()) return text.toUpperCase();
  if (example === example.toLowerCase()) return text.toLowerCase();
  if (example[0] === example[0].toUpperCase()) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }
  return text;
}
