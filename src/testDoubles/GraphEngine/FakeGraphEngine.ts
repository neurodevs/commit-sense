import { GraphEngine } from '../../impl/WorkspaceGraphEngine.js'

export default class FakeGraphEngine implements GraphEngine {
    public static numCallsToConstructor = 0
    public static numCallsToInitialize = 0

    public constructor() {
        FakeGraphEngine.numCallsToConstructor++
    }

    public async initialize() {
        FakeGraphEngine.numCallsToInitialize++
    }

    public static resetTestDouble() {
        FakeGraphEngine.numCallsToConstructor = 0
        FakeGraphEngine.numCallsToInitialize = 0
    }
}
