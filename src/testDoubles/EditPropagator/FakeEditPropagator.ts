import * as vscode from 'vscode'

import { EditPropagator } from '../../impl/LiveEditPropagator.js'

export default class FakeEditPropagator implements EditPropagator {
    public static numCallsToConstructor = 0
    public static callsToPropagateEdit: vscode.TextDocumentChangeEvent[] = []

    public constructor() {
        FakeEditPropagator.numCallsToConstructor++
    }

    public async propagate(event: vscode.TextDocumentChangeEvent) {
        FakeEditPropagator.callsToPropagateEdit.push(event)
    }

    public static resetTestDouble() {
        FakeEditPropagator.numCallsToConstructor = 0
        FakeEditPropagator.callsToPropagateEdit = []
    }
}
