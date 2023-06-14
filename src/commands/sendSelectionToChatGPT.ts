import * as vscode from "vscode";
import { sendToChatGPT } from "../core/openai";

export default async () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    const selectedText = document.getText(selection);

    // Get the apiKey and rules from the configuration
    const config = vscode.workspace.getConfiguration("vs-gpt-magic");
    const apiKey = config.get<string>("apiKey", "");
    const rules = config.get<string>("rules", "");

    if (!apiKey) {
      vscode.window.showErrorMessage(
        "Please set the API key in the extension settings."
      );
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
