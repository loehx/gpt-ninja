import * as vscode from "vscode";
import sendSelectionToChatGPT from "./commands/sendSelectionToChatGPT";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vs-gpt-magic" is now active!');

  let sendSelectionDisposable = vscode.commands.registerCommand(
    "vs-gpt-magic.sendSelectionToChatGPT",
    sendSelectionToChatGPT
  );

  // Check if API key is set, otherwise open settings
  const config = vscode.workspace.getConfiguration("vs-gpt-magic");
  const apiKey = config.get<string>("apiKey", "");
  if (!apiKey) {
    vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "vs-gpt-magic"
    );
  }

  context.subscriptions.push(sendSelectionDisposable);
}

export function deactivate() {}
