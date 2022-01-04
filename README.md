# Usage

To see this extension in action:

1. Build and run the extension
1. In the debugged window, run `Test office scripts`
1. This should open a file called `main.ts` that uses a fake office scripts function called `doExcelThings`.
1. Hover over `doExcelThings` to confirm it is getting pulled in from a file called `fake-office.d.ts` ( can you can run go to definition to check)


# Implementation details

The key is that the virtual file system provider that provides the `.ts` office script file contents should also be able to provide a types `.d.ts` file. Then when any office script file is opened, the extension should also open the `.d.ts` using `vscode.workspace.openTextDocument`. This results in both files being treated as part of the same TS project

Currently the virtual file system provider uses the `memfs` scheme, but this must be changed before shipping (and requires a minor change in VS Code to enable for the new scheme).