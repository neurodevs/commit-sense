import { GraphEngine } from '../../impl/WorkspaceGraphEngine.js'

export default class FakeGraphEngine implements GraphEngine {
    public static numCallsToConstructor = 0

    public constructor() {
        FakeGraphEngine.numCallsToConstructor++
    }

    public static resetTestDouble() {
        FakeGraphEngine.numCallsToConstructor = 0
    }
}
