import { readdir } from 'fs/promises'
import {
    createFakeDir,
    fakeReadDir,
    resetCallsToReadDir,
    setFakeReadDirResult,
} from '@neurodevs/fake-node-core'
import AbstractSpruceTest, { test, assert } from '@neurodevs/node-tdd'

import WorkspaceGraphEngine from '../../impl/WorkspaceGraphEngine.js'
import SpyWorkspaceGraphEngine from '../../testDoubles/GraphEngine/SpyWorkspaceGraphEngine.js'

export default class WorkspaceGraphEngineTest extends AbstractSpruceTest {
    private static instance: SpyWorkspaceGraphEngine

    protected static async beforeEach() {
        await super.beforeEach()

        this.setSpyWorkspaceGraphEngine()
        this.setFakeReadDir()

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
            {
                [this.packageNameA]: {},
                [this.packageNameB]: {},
            },
            'Graph data structure is not as expected!'
        )
    }

    private static async initialize() {
        await this.instance.initialize()
    }

    private static readonly workspaceDir = this.generateId()

    private static readonly packageNameA = this.generateId()
    private static readonly packageNameB = this.generateId()

    private static setSpyWorkspaceGraphEngine() {
        WorkspaceGraphEngine.Class = SpyWorkspaceGraphEngine
    }

    private static setFakeReadDir() {
        WorkspaceGraphEngine.readDir = fakeReadDir as unknown as typeof readdir
        resetCallsToReadDir()

        setFakeReadDirResult(this.workspaceDir, [
            createFakeDir({ name: this.packageNameA }),
            createFakeDir({ name: this.packageNameB }),
        ])

        setFakeReadDirResult(`${this.workspaceDir}/${this.packageNameA}`, [])
        setFakeReadDirResult(`${this.workspaceDir}/${this.packageNameB}`, [])
    }

    private static WorkspaceGraphEngine() {
        return WorkspaceGraphEngine.Create({
            workspaceDir: this.workspaceDir,
        }) as SpyWorkspaceGraphEngine
    }
}
