import * as vscode from 'vscode'

export default class LiveEditPropagator implements EditPropagator {
    public static Class?: EditPropagatorConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async propagate(event: vscode.TextDocumentChangeEvent) {
        console.log(JSON.stringify(event, null, 4))
    }
}

export interface EditPropagator {
    propagate(event: vscode.TextDocumentChangeEvent): Promise<void>
}

export type EditPropagatorConstructor = new () => EditPropagator
