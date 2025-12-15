import AbstractModuleTest, { test, assert } from '@neurodevs/node-tdd'

import NpmPropagationCoordinator, {
    PropagationCoordinator,
} from '../../impl/NpmPropagationCoordinator.js'

export default class NpmPropagationCoordinatorTest extends AbstractModuleTest {
    private static instance: PropagationCoordinator

    private static readonly repoPath = this.generateId()

    private static readonly repoPaths = [
        this.generateId(),
        this.generateId(),
        this.repoPath,
    ]

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.NpmPropagationCoordinator()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    private static NpmPropagationCoordinator() {
        return NpmPropagationCoordinator.Create(this.repoPath, this.repoPaths)
    }
}
