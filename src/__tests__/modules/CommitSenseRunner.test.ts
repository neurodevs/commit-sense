import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
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

    @test()
    protected static async initializeClonesExpectedGitUrls() {
        await this.instance.initialize()

        assert.isEqualDeep(
            FakeAutocloner.callsToRun[0]?.urls,
            this.gitUrls,
            'Did not call run with expected urls!'
        )
    }

    @test()
    protected static async initializeClonesIntoExpectedDirPath() {
        await this.instance.initialize()

        assert.isEqualDeep(
            FakeAutocloner.callsToRun[0]?.dirPath,
            this.installDir,
            'Did not call run with expected dirPath!'
        )
    }

    private static setFakeAutocloner() {
        GitAutocloner.Class = FakeAutocloner
        FakeAutocloner.resetTestDouble()
    }

    private static readonly gitUrls = [generateId(), generateId()]
    private static readonly installDir = generateId()

    private static CommitSenseRunner() {
        return CommitSenseRunner.Create({
            gitUrls: this.gitUrls,
            installDir: this.installDir,
        })
    }
}
