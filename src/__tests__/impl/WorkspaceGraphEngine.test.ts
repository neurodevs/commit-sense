import AbstractSpruceTest, { test, assert } from '@neurodevs/node-tdd'

import WorkspaceGraphEngine from '../../impl/WorkspaceGraphEngine.js'
import SpyWorkspaceGraphEngine from '../../testDoubles/GraphEngine/SpyWorkspaceGraphEngine.js'

export default class WorkspaceGraphEngineTest extends AbstractSpruceTest {
    private static instance: SpyWorkspaceGraphEngine

    protected static async beforeEach() {
        await super.beforeEach()

        this.setSpyWorkspaceGraphEngine()

        this.instance = this.WorkspaceGraphEngine()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    @test()
    protected static async initializePopulatesGraphDataStructure() {
        await this.initialize()

        const graph = this.instance.getGraph()

        assert.isEqualDeep(
            graph,
            {},
            'Graph data structure is not as expected!'
        )
    }

    private static async initialize() {
        await this.instance.initialize()
    }

    private static readonly workspaceDir = this.generateId()

    private static setSpyWorkspaceGraphEngine() {
        WorkspaceGraphEngine.Class = SpyWorkspaceGraphEngine
    }

    private static WorkspaceGraphEngine() {
        return WorkspaceGraphEngine.Create({
            workspaceDir: this.workspaceDir,
        }) as SpyWorkspaceGraphEngine
    }
}
