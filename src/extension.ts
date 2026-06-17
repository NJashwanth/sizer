import * as vscode from 'vscode';
import * as fs from 'fs';

function formatFileSize(bytes: number, format: string): string {
    if (format === 'bytes') {
        return `${bytes}B`;
    }

    if (bytes < 1024) {
        return `${bytes}B`;
    }

    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = -1;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)}${units[unitIndex]}`;
}

class FileSizeDecorationProvider implements vscode.FileDecorationProvider {
    private readonly _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
    readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

    provideFileDecoration(uri: vscode.Uri, _token: vscode.CancellationToken): vscode.FileDecoration | undefined {
        const config = vscode.workspace.getConfiguration('fileSizeExplorer');
        if (!config.get<boolean>('showSize', true)) {
            return undefined;
        }

        try {
            const stat = fs.statSync(uri.fsPath);
            if (!stat.isFile()) {
                return undefined;
            }

            const format = config.get<string>('sizeFormat', 'auto');
            const badge = formatFileSize(stat.size, format);
            const tooltip = `File size: ${formatFileSize(stat.size, 'auto')}`;

            return {
                badge,
                tooltip,
                color: new vscode.ThemeColor('charts.blue'),
            };
        } catch {
            return undefined;
        }
    }

    refresh(uri?: vscode.Uri): void {
        this._onDidChangeFileDecorations.fire(uri);
    }

    dispose(): void {
        this._onDidChangeFileDecorations.dispose();
    }
}

export function activate(context: vscode.ExtensionContext): void {
    const provider = new FileSizeDecorationProvider();

    context.subscriptions.push(
        vscode.window.registerFileDecorationProvider(provider)
    );

    const watchers: vscode.FileSystemWatcher[] = [];

    function setupWatchers(): void {
        for (const watcher of watchers) {
            watcher.dispose();
        }
        watchers.length = 0;

        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return;
        }

        for (const folder of folders) {
            const pattern = new vscode.RelativePattern(folder, '**/*');
            const watcher = vscode.workspace.createFileSystemWatcher(pattern);

            watcher.onDidCreate(uri => provider.refresh(uri));
            watcher.onDidChange(uri => provider.refresh(uri));
            watcher.onDidDelete(uri => provider.refresh(uri));

            watchers.push(watcher);
            context.subscriptions.push(watcher);
        }
    }

    setupWatchers();

    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(() => {
            setupWatchers();
            provider.refresh();
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('fileSizeExplorer')) {
                provider.refresh();
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            provider.refresh(e.document.uri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('fileSizeExplorer.refreshDecorations', () => {
            provider.refresh();
            vscode.window.showInformationMessage('File size decorations refreshed!');
        })
    );

    context.subscriptions.push(provider);
}

export function deactivate(): void {}
