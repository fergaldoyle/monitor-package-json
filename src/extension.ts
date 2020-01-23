import * as vscode from 'vscode';
import { spawn, exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

	const log = vscode.window.createOutputChannel('monitor-package-json');
	log.show();
	log.appendLine('Initalizing monitor-package-json');

	const workspace = vscode.workspace.workspaceFolders![0];
	const fileWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(
		workspace.uri.fsPath,
		'**/package.json'
	), false, false, false);
	fileWatcher.onDidChange(uri => {
		log.appendLine('Executing npm list --depth=0 --prod --dev');
		const cwd = uri.fsPath.replace('package.json', '');
		exec('npm list --depth=0 --prod --dev', { cwd }, error => {
			if (error && error.toString().match(/npm ERR! missing|npm ERR! invalid/g)) {
				const message = 'Detected missing or outdated packages. Running npm install...(this may take a few minutes)';
				log.appendLine(message);
				vscode.window.showInformationMessage(message);
				exec('npm install', { cwd }, error => {
					if(error) {
						vscode.window.showInformationMessage('npm install failed, please try to manually run the command');
						return;
					}
					vscode.window.showInformationMessage('npm install has finished, You may need to restart or recompile your project.');
				});
				return;
			}
			log.appendLine('Packages are correctly installed.');
		});
	});

}

// this method is called when your extension is deactivated
export function deactivate() {}



				// const p = spawn('npm install', { shell: true, cwd });
				// p.addListener('exit', console.log);
				// p.addListener('error', error =>{
				// 	console.log('error', error);
				// });

				// p.stdout.on('data', data => {
				// 	console.log('data', data.toString());
				// 	vscode.window.showInformationMessage('npm install has finished, You may need to restart or recompile your project.');
				// });
				// p.stdout.on('close', (data: any) => {
				// 	console.log('close', data);
				// });
				// p.stdout.on('end', (data: any) => {
				// 	console.log('end', data);
				// });
				// p.stdout.on('error', (data: any) => {
				// 	console.log('error', data);
				// });

				// p.stderr.on('stderr data', (data: any) => {
				// 	console.log('stderr data', data);
				// })
