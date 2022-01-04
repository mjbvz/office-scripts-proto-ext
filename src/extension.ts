import { TextEncoder } from 'util';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const fakeMain = vscode.Uri.from({
		scheme: FsProvider.scheme,
		path: '/main.ts'
	});

	const fakeDts = vscode.Uri.from({
		scheme: FsProvider.scheme,
		path: '/fake-office.d.ts'
	});

	// Register command for testing functionality
	context.subscriptions.push(vscode.commands.registerCommand('test-ext.helloWorld', async () => {
		// Simulate opening a ts file (this would be the office script file the user works with)
		const doc2 = await vscode.workspace.openTextDocument(fakeMain);
		await vscode.window.showTextDocument(doc2);

		// Open the d.ts just in the background (does not show to user)
		// Office scripts would do this in the background when the user first opens a script to edit
		await vscode.workspace.openTextDocument(fakeDts);
	}));

	// Register file system provider
	context.subscriptions.push(vscode.workspace.registerFileSystemProvider(FsProvider.scheme, new FsProvider(), {}));
}

class FsProvider implements vscode.FileSystemProvider {
	// Note: This must be 'memfs' currently.
	// VS Code has special logic for handling this uri scheme internally that allows all files in it to be grouped into
	// a single project.
	// 
	// For office scripts, please share the scheme you'd like to use and we can add it to the list
	static scheme = 'memfs';

	// TODO: You can use this event to mark when the d.ts changes. 
	private readonly _onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	public readonly onDidChangeFile = this._onDidChangeFile.event;

	watch(uri: vscode.Uri, options: {
		recursive: boolean; excludes // Import the module and reference it with the alias vscode in your code below
		: string[];
	}): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	stat(uri: vscode.Uri): vscode.FileStat {
		return {
			type: vscode.FileType.File,
			ctime: 0,
			mtime: 0,
			size: 0,
			permissions: undefined
		};
	}

	readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
		throw new Error('Method not implemented.');
	}

	createDirectory(uri: vscode.Uri): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {

		let text: string;
		if (uri.toString().endsWith('.d.ts')) {
			// Return the actual d.ts contents here.
			text = `/**
			* Does excel things.
			*/
			declare function doExcelThings(): number;`;
		} else {
			// Simulate some office script file contents
			text = `function main() { doExcelThings(); }`;
		}
		return new TextEncoder().encode(text);
	}

	writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	delete(uri: vscode.Uri, options: { recursive: boolean; }): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}
}
