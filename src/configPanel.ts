import * as vscode from 'vscode';

export default class PheoConfig {
  constructor(ultum: any) {

  }
  async createPanel() {

    vscode.window.createWebviewPanel(
      'configPanel',
      'PheoCode Config',
      vscode.ViewColumn.One,
      {}
    );
  }
}