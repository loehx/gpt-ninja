import * as vscode from "vscode";
import sendSelectionToChatGPT from "./commands/sendSelectionToChatGPT";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "gpt-ninja" is now active!');

  let helloWorldDisposable = vscode.commands.registerCommand(
    "gpt-ninja.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from gpt-ninja!");
    }
  );

  let sendSelectionDisposable = vscode.commands.registerCommand(
    "gpt-ninja.sendSelectionToChatGPT",
    sendSelectionToChatGPT
  );

  // Check if API key is set, otherwise open settings
  const config = vscode.workspace.getConfiguration("gpt-ninja");
  const apiKey = config.get<string>("apiKey", "");
  if (!apiKey) {
    vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "gpt-ninja.apiKey"
    );
  }

  context.subscriptions.push(helloWorldDisposable, sendSelectionDisposable);
}

export function deactivate() {}
