import * as vscode from 'vscode'
import CommitSenseRunner from './impl/CommitSenseRunner'

export async function activate(context: vscode.ExtensionContext) {
    const runner = CommitSenseRunner.Create({
        installDir: '/Users/ericthecurious/commitsense',
        gitUrls: [
            'https://github.com/neurodevs/node-lsl.git',
            'https://github.com/neurodevs/node-ble.git',
            'https://github.com/neurodevs/node-xdf.git',
            'https://github.com/neurodevs/node-biosensors.git',
            'https://github.com/neurodevs/i-insula.git',
        ],
    })

    await runner.initialize()
    await runner.start()

    context.subscriptions.push({
        dispose: () => {
            // optional cleanup logic
        },
    })
}

export function deactivate() {
    // optional teardown, e.g. dispose watchers or close handles
}
