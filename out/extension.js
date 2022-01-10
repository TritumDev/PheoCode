"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const socket_io_client_1 = require("socket.io-client");
const funcs_1 = require("./funcs");
const WEBSOCKET_URL = "https://pheonixapi.com/";
const config = vscode.workspace.getConfiguration('pheocode');
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
function activate(context) {
    let socketio = (0, socket_io_client_1.connect)(WEBSOCKET_URL, {
        auth: {
            token: config.get('api.token')
        }
    });
    const funcs = new funcs_1.default({ statusBar: statusBarItem, context, config, socketio });
    funcs.updateStatus("initialization");
    console.log('Congratulations, your extension "pheocode" is now active!');
    let commands = [
        { command: "statusbar.toggle", callback: () => funcs.loaded() },
        { command: "configure", callback: () => funcs.configure() },
        { command: "helloWorld", callback: () => funcs.createPanel() },
    ];
    for (let { command, callback } of commands) {
        context.subscriptions.push(vscode.commands.registerCommand(`pheocode.${command}`, callback));
    }
    vscode.window.onDidChangeActiveTextEditor(() => funcs.postData());
    vscode.window.onDidChangeTextEditorSelection(() => funcs.postData());
    vscode.workspace.onDidSaveTextDocument(() => funcs.postData());
    vscode.workspace.onDidChangeTextDocument(() => funcs.postData());
    vscode.workspace.onDidCloseTextDocument(() => funcs.postData());
    vscode.workspace.onDidOpenTextDocument(() => funcs.postData());
    vscode.workspace.onDidRenameFiles(() => funcs.postData());
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map