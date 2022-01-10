import * as vscode from 'vscode';
import { connect } from 'socket.io-client';

import PheoFuncs from './funcs';

const WEBSOCKET_URL = "https://pheonixapi.com/";

const config = vscode.workspace.getConfiguration('pheocode');
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
export function activate(context: vscode.ExtensionContext) {
	let socketio = connect(WEBSOCKET_URL, {
		auth: {
			token: config.get('api.token')
		}
	});
	const funcs = new PheoFuncs({ statusBar: statusBarItem, context, config, socketio });
	funcs.updateStatus("initialization");
	console.log('Congratulations, your extension "pheocode" is now active!');

	let commands = [
		{ command: "statusbar.toggle", callback: () => funcs.loaded() },
		{ command: "configure", callback: () => funcs.configure() },
		{ command: "helloWorld", callback: () => funcs.createPanel() },
	];
	for (let { command, callback } of commands) { context.subscriptions.push(vscode.commands.registerCommand(`pheocode.${command}`, callback)); }

	vscode.window.onDidChangeActiveTextEditor(() => funcs.postData());
	vscode.window.onDidChangeTextEditorSelection(() => funcs.postData());
	vscode.workspace.onDidSaveTextDocument(() => funcs.postData());
	vscode.workspace.onDidChangeTextDocument(() => funcs.postData());
	vscode.workspace.onDidCloseTextDocument(() => funcs.postData());
	vscode.workspace.onDidOpenTextDocument(() => funcs.postData());
	vscode.workspace.onDidRenameFiles(() => funcs.postData());
}

export function deactivate() { }
