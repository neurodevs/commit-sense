import { TextDocumentChangeEvent } from 'vscode'

export default class FakeWorkspace {
    public static numCallsToConstructor = 0
    public static callsToOnDidChangeTextDocument: FakeListener[] = []

    private listeners: FakeListener[] = []

    public constructor() {
        FakeWorkspace.numCallsToConstructor++
    }

    public onDidChangeTextDocument(listener: FakeListener) {
        FakeWorkspace.callsToOnDidChangeTextDocument.push(listener)
        this.listeners.push(listener)

        return { dispose: () => this.removeListener(listener) }
    }

    private removeListener(listener: FakeListener) {
        const i = this.listeners.indexOf(listener)
        if (i >= 0) {
            this.listeners.splice(i, 1)
        }
    }

    public resetTestDouble() {
        this.listeners = []
    }

    public static resetTestDouble() {
        FakeWorkspace.numCallsToConstructor = 0
        FakeWorkspace.callsToOnDidChangeTextDocument = []
    }
}

export type FakeListener = (event: TextDocumentChangeEvent) => void
