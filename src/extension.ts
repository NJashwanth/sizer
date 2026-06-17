import * as vscode from 'vscode';
import * as fs from 'fs';

function formatSize(bytes: number, format: string): string {
    if (format === 'bytes') {
        return `${bytes} B`;
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = -1;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function updateStatusBar(statusBarItem: vscode.StatusBarItem): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        statusBarItem.hide();
        return;
    }

    const config = vscode.workspace.getConfiguration('sizer');
    if (!config.get<boolean>('showSize', true)) {
        statusBarItem.hide();
        return;
    }

    const uri = editor.document.uri;
    if (uri.scheme !== 'file') {
        statusBarItem.hide();
        return;
    }

    try {
        const stat = fs.statSync(uri.fsPath);
        const format = config.get<string>('sizeFormat', 'auto');
        const size = formatSize(stat.size, format);
        statusBarItem.text = `$(file) ${size}`;
        statusBarItem.tooltip = `File size: ${formatSize(stat.size, 'auto')}`;
        statusBarItem.show();
    } catch {
        statusBarItem.hide();
    }
}

export function activate(context: vscode.ExtensionContext): void {
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    updateStatusBar(statusBarItem);

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            updateStatusBar(statusBarItem);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(() => {
            updateStatusBar(statusBarItem);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('sizer')) {
                updateStatusBar(statusBarItem);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sizer.refreshDecorations', () => {
            updateStatusBar(statusBarItem);
            vscode.window.showInformationMessage('Sizer refreshed!');
        })
    );

    context.subscriptions.push(statusBarItem);
}

export function deactivate(): void {}
