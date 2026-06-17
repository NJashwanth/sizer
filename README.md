# File Size Explorer

Display file sizes as badges directly in the VS Code file explorer — no need to switch to Finder or Explorer to check file sizes.

## Features

- **File size badges** in the explorer tree next to every file
- **Smart formatting** — automatically shows B, KB, MB, or GB
- **Real-time updates** — badges refresh when files are created, modified, or deleted
- **Configurable** — toggle visibility and choose between auto or bytes format
- **Lightweight** — reads file metadata on demand with no caching overhead

## Installation & Setup

1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press **F5** to launch the Extension Development Host

To package for distribution:

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the generated `.vsix` file via **Extensions > Install from VSIX**.

## Quick Start

1. Open any folder in VS Code
2. Look at the file explorer — every file now has a size badge (e.g., `2.3KB`)
3. Open Settings and search "File Size Explorer" to configure

## Usage

### Viewing File Sizes

File sizes appear as colored badges next to filenames in the explorer panel. Hover over a badge to see the tooltip with the full size.

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `fileSizeExplorer.showSize` | `true` | Enable or disable size badges |
| `fileSizeExplorer.sizeFormat` | `auto` | `auto` (B/KB/MB/GB) or `bytes` (always bytes) |

### Refresh Command

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **File Size Explorer: Refresh** to manually refresh all decorations.

## How It Works

The extension uses VS Code's `FileDecorationProvider` API to attach badge text and tooltips to file URIs in the explorer. File sizes are read via `fs.statSync()` on demand — no background scanning or caching is needed.

A `FileSystemWatcher` per workspace folder listens for create, change, and delete events to trigger decoration refreshes automatically.

## Customization Ideas

1. **Color-code by size** — red for large files, green for small
2. **Exclude patterns** — skip `node_modules` or other directories
3. **Size thresholds** — only show badges for files above a certain size
4. **Status bar summary** — show total workspace size in the status bar
5. **Sort by size** — add a custom tree view sorted by file size

## Troubleshooting

**Badges not showing?**
- Check that `fileSizeExplorer.showSize` is `true` in Settings
- Run the refresh command from the Command Palette
- Reload the VS Code window (`Developer: Reload Window`)

**Wrong sizes after editing?**
- Sizes update on save. Unsaved changes won't reflect until the file is written to disk.

**Performance issues with large projects?**
- The extension reads file stats on demand, so it scales well. If you notice slowness, check if other extensions are causing the issue.

## API Reference

- [`vscode.FileDecorationProvider`](https://code.visualstudio.com/api/references/vscode-api#FileDecorationProvider)
- [`vscode.workspace.createFileSystemWatcher`](https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher)
- [`vscode.workspace.onDidChangeConfiguration`](https://code.visualstudio.com/api/references/vscode-api#workspace.onDidChangeConfiguration)
- [`fs.statSync`](https://nodejs.org/api/fs.html#fsstatsyncpath-options)

## License

MIT
