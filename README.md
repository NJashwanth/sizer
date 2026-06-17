# Sizer

Display file sizes in the VS Code status bar for any file you open — no need to switch to Finder or Explorer to check file sizes.

## Features

- **File size in status bar** — shows the size of the currently open file (e.g., `2.3 KB`)
- **Smart formatting** — automatically shows B, KB, MB, or GB
- **Real-time updates** — size updates when you switch files or save
- **All file types** — works with every file, not just images
- **Configurable** — toggle visibility and choose between auto or bytes format
- **Lightweight** — reads file metadata on demand with no caching overhead

![Sizer in action](demo.png)

## How to Use

1. Install the extension
2. Open any file in VS Code
3. Look at the **bottom-right status bar** — you'll see the file size displayed like:

```
📄 2.3 KB
```

4. Switch between files — the size updates automatically
5. Save a file — the size refreshes to reflect changes

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `sizer.showSize` | `true` | Show or hide the file size in the status bar |
| `sizer.sizeFormat` | `auto` | `auto` (B/KB/MB/GB) or `bytes` (always show raw bytes) |

To configure, open Settings (`Cmd+,` / `Ctrl+,`) and search for **Sizer**.

## Refresh Command

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **Sizer: Refresh** to manually refresh the displayed size.

## How It Works

The extension creates a status bar item that reads the file size of the active editor's file via `fs.statSync()`. It listens for editor switches and file saves to keep the displayed size up to date.

## Troubleshooting

**Size not showing?**
- Make sure a file is open in the editor (the size hides when no file is active)
- Check that `sizer.showSize` is `true` in Settings
- Try the refresh command from the Command Palette
- Reload the VS Code window (`Developer: Reload Window`)

**Size not updating after edits?**
- The size updates on save. Unsaved changes won't reflect until the file is written to disk.

## Development

```bash
git clone https://github.com/NJashwanth/sizer.git
cd sizer
npm install
npm run compile
```

Press **F5** in VS Code to launch the Extension Development Host and test the extension.

## Author

Built by [Jashwanth Neela](https://jneela.dev/).

## License

MIT
