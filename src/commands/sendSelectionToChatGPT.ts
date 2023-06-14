import * as vscode from "vscode";
import { sendToChatGPT } from "../core/openai";

export default async () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    let selectedText = document.getText(selection);

    // If no text is selected, retrieve the current line
    if (!selectedText) {
      const lineNumber = selection.active.line;
      const line = document.lineAt(lineNumber);
      selectedText = line.text;
    }

    // Get the apiKey and rules from the configuration
    const config = vscode.workspace.getConfiguration("vs-gpt-magic");
    const apiKey = config.get<string>("apiKey", "");

    if (!apiKey) {
      vscode.window.showErrorMessage(
        "Please set the API key in the extension settings."
      );
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "vs-gpt-magic"
      );
      return;
    }

    if (!selectedText) {
      return;
    }

    vscode.window.showInformationMessage("Asking ChatGPT ...");

    try {
      const chatGPTResponse = await sendToChatGPT(selectedText);

      editor.edit((editBuilder) => {
        editBuilder.replace(selection, chatGPTResponse);
      });
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
  }
};
