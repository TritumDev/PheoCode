"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const document_1 = require("./document");
const path = require("path");
class PheoUtils {
    constructor(opt) {
        this.opt = opt;
        this.statusBar = opt?.statusBar;
        this.context = opt?.context;
        this.config = opt?.config;
        this.socketio = opt?.socketio;
        this.updateTimeout = null;
        this.statusBar.show();
    }
    loaded() {
        vscode.window.showInformationMessage("PheoCode is now watching");
    }
    configure() {
        vscode.window.showInformationMessage("What can I help you configure?", "API Token", "API Endpoint").then(async (selection) => {
            switch (selection?.toLowerCase()) {
                case "api token":
                    {
                        vscode.window.showInputBox({ prompt: "Please enter your API Token" }).then((token) => {
                            if (token) {
                                this.config.update("api.token", token);
                                this.updateStatus("saved");
                            }
                        });
                    }
                    break;
                case "api endpoint":
                    {
                        vscode.window.showInputBox({ prompt: "Please enter your API Endpoint", value: this.config.get("api.endpoint") }).then((endpoint) => {
                            if (endpoint) {
                                this.config.update("api.endpoint", endpoint);
                                this.updateStatus("saved");
                            }
                        });
                    }
                    break;
            }
        });
    }
    async updateStatus(status = "idle", options) {
        switch (status.toLowerCase()) {
            case "initialization":
                {
                    this.statusBar.text = "$(loading~spin) Pheo";
                }
                break;
            case "idle":
                {
                    this.statusBar.text = "$(globe) Pheo";
                    this.statusBar.color = "green";
                    this.statusBar.tooltip = "PheoCode is broadcasting";
                    this.statusBar.command = "pheocode.configure";
                }
                break;
            case "saved":
                {
                    this.statusBar.text = "$(symbol-file) Pheo";
                    this.statusBar.color = "orange";
                    this.statusBar.tooltip = "PheoCode has saved your changes";
                }
                break;
        }
        if (status !== "idle") {
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => this.updateStatus("idle"), options?.timeout || 5000);
        }
    }
    async createPanel() {
        let panel = vscode.window.createWebviewPanel('configPanel', 'PheoCode Config', vscode.ViewColumn.One, {});
        panel.webview.html = (0, document_1.default)();
    }
    async postData() {
        if (vscode.window.activeTextEditor) {
            let currentSelections = vscode.window.activeTextEditor.selection;
            let currentDocument = vscode.window.activeTextEditor.document;
            let sizeOfFile = await (await vscode.workspace.fs.stat(currentDocument.uri)).size || currentDocument.getText().length;
            console.log(sizeOfFile);
            const postData = {
                workspace: vscode.workspace.getWorkspaceFolder(currentDocument.uri)?.name ?? null,
                file: {
                    location: currentDocument.fileName,
                    name: path.basename(currentDocument.fileName),
                    extension: path.extname(currentDocument.fileName),
                    lines: currentDocument.lineCount.toLocaleString(),
                    image: `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_${path.extname(currentDocument.fileName).split(".").pop()}.svg`,
                    position: {
                        currentLine: currentSelections.active.line + 1,
                        currentColumn: currentSelections.active.character + 1,
                    }
                }
            };
            this.socketio.emit("vscode:update", postData);
        }
    }
}
exports.default = PheoUtils;
//# sourceMappingURL=funcs.js.map