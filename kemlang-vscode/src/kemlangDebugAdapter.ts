import * as vscode from 'vscode';
import * as path from 'path';

export function activateDebug(context: vscode.ExtensionContext) {
  const factory: vscode.DebugAdapterDescriptorFactory = {
    createDebugAdapterDescriptor: (session: vscode.DebugSession) => {
      // Replace this with the actual path to your debugger or interpreter
      const command = 'node';
      const args = [
        context.asAbsolutePath('dist/debug/kemlangDebug.js'),
      ];

      return new vscode.DebugAdapterExecutable(command, args);
    }
  };

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory('kemlang', factory)
  );
}
