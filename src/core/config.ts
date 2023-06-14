import * as vscode from "vscode";

export function loadConfig() {
  let config = vscode.workspace.getConfiguration("vs-gpt-magic");
  let apiKey = config.get<string>("apiKey");
  let rules = config.get<string>("rules") || "You are a helpful assistant.";
  let extractCodeFromResponse =
    config.get<boolean>("extractCodeFromResponse") || false;

  if (!apiKey) {
    vscode.window.showErrorMessage(
      "Please configure 'vs-gpt-magic.apiKey' in your settings.",
      "Open Settings"
    ).then((buttonSelection) => {
      if (buttonSelection === "Open Settings") {
        vscode.commands.executeCommand("workbench.action.openSettings", "vs-gpt-magic.apiKey");
      }
    });
    return null;
  }

  return { apiKey, rules, extractCodeFromResponse };
}

export type Config = ReturnType<typeof loadConfig>;
