import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import { FakeAutocloner, GitAutocloner } from '@neurodevs/meta-node'
import { TextDocumentChangeEvent } from 'vscode'
import CommitSenseRunner, { CommitSense } from '../../modules/CommitSenseRunner'
import { resetVscodeTestDoubles } from '../../testDoubles/vscode/fakeVscode'
import FakeWorkspace from '../../testDoubles/vscode/FakeWorkspace'

export default class CommitSenseRunnerTest extends AbstractSpruceTest {
    private static instance: CommitSense

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeAutocloner()
        this.setFakeVscode()

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
        await this.initialize()

        assert.isEqualDeep(
            FakeAutocloner.callsToRun[0]?.dirPath,
            this.installDir,
            'Did not call run with expected dirPath!'
        )
    }

    @test()
    protected static async startThrowsIfInitializeNotCalled() {
        const err = await assert.doesThrowAsync(
            async () => await this.instance.start()
        )

        assert.isEqual(
            err.message,
            'Please call initialize() before start()!',
            'Did not receive the expected error!'
        )
    }

    @test()
    protected static async registersLiveEditWatcherWithVscode() {
        let wasHit = false

        //@ts-ignore
        this.instance.onLiveEdit = async (_event: TextDocumentChangeEvent) => {
            wasHit = true
        }

        await this.initialize()
        await this.start()

        const listener = FakeWorkspace.callsToOnDidChangeTextDocument[0]
        listener({} as TextDocumentChangeEvent)

        assert.isTrue(wasHit, 'Did not register live edit watcher!')
    }

    private static async initialize() {
        await this.instance.initialize()
    }

    private static async start() {
        await this.instance.start()
    }

    private static readonly gitUrls = [generateId(), generateId()]
    private static readonly installDir = generateId()

    private static setFakeAutocloner() {
        GitAutocloner.Class = FakeAutocloner
        FakeAutocloner.resetTestDouble()
    }

    private static setFakeVscode() {
        // package.json jest moduleNameMapper handles this
        resetVscodeTestDoubles()
    }

    private static CommitSenseRunner() {
        return CommitSenseRunner.Create({
            gitUrls: this.gitUrls,
            installDir: this.installDir,
        })
    }
}
