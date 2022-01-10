"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class PheoConfig {
    constructor(ultum) {
    }
    async createPanel() {
        vscode.window.createWebviewPanel('configPanel', 'PheoCode Config', vscode.ViewColumn.One, {});
    }
}
exports.default = PheoConfig;
//# sourceMappingURL=configPanel.js.map