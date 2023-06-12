import * as vscode from "vscode";

export function loadConfig() {
  let config = vscode.workspace.getConfiguration("gpt-ninja");
  let apiKey = config.get("apiKey") as any;
  let rulesArray = config.get("rules") as any;

  let rules = rulesArray.join("\n");

  if (!apiKey) {
    vscode.window.showErrorMessage(
      "Please configure 'gpt-ninja.apiKey' in your settings."
    );
    return null;
  }

  if (!rules) {
    vscode.window.showErrorMessage(
      "Please configure 'gpt-ninja.rules' in your settings."
    );
    return null;
  }

  return { apiKey, rules };
}
