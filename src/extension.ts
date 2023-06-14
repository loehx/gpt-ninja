import * as vscode from "vscode";
import sendSelectionToChatGPT from "./commands/sendSelectionToChatGPT";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vs-gpt-rocket" is now active!');

  let sendSelectionDisposable = vscode.commands.registerCommand(
    "vs-gpt-rocket.sendSelectionToChatGPT",
    sendSelectionToChatGPT
  );

  let openSettingsDisposable = vscode.commands.registerCommand(
    "vs-gpt-rocket.openSettings",
    () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "vs-gpt-rocket"
      );
    })

  // Check if API key is set, otherwise open settings
  const config = vscode.workspace.getConfiguration("vs-gpt-rocket");
  const apiKey = config.get<string>("apiKey", "");
  if (!apiKey) {
    vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "vs-gpt-rocket"
    );
  }

  context.subscriptions.push(sendSelectionDisposable, openSettingsDisposable);
}

export function deactivate() { }
