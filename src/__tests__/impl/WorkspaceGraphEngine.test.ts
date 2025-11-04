import AbstractSpruceTest, { test, assert } from '@neurodevs/node-tdd'

import WorkspaceGraphEngine, {
    GraphEngine,
} from '../../impl/WorkspaceGraphEngine.js'

export default class WorkspaceGraphEngineTest extends AbstractSpruceTest {
    private static instance: GraphEngine

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.WorkspaceGraphEngine()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    private static WorkspaceGraphEngine() {
        return WorkspaceGraphEngine.Create()
    }
}
