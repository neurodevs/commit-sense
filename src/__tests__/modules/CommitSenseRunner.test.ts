import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import CommitSenseRunner, { CommitSense } from '../../modules/CommitSenseRunner'

export default class CommitSenseRunnerTest extends AbstractSpruceTest {
    private static instance: CommitSense

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.CommitSenseRunner()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    private static CommitSenseRunner() {
        return CommitSenseRunner.Create()
    }
}
