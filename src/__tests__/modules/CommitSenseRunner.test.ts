import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import { FakeAutocloner, GitAutocloner } from '@neurodevs/meta-node'
import CommitSenseRunner, { CommitSense } from '../../modules/CommitSenseRunner'

export default class CommitSenseRunnerTest extends AbstractSpruceTest {
    private static instance: CommitSense

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeAutocloner()

        this.instance = this.CommitSenseRunner()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    @test()
    protected static async createsGitAutocloner() {
        assert.isEqual(
            FakeAutocloner.numCallsToConstructor,
            1,
            'Did not create GitAutocloner!'
        )
    }

    private static setFakeAutocloner() {
        GitAutocloner.Class = FakeAutocloner
        FakeAutocloner.resetTestDouble()
    }

    private static CommitSenseRunner() {
        return CommitSenseRunner.Create()
    }
}
