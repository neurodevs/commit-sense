import { PathLike } from 'fs'
import os from 'os'
import path from 'path'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import generateId from '@neurodevs/generate-id'
import { FakeAutocloner, GitAutocloner } from '@neurodevs/meta-node'
import { TextDocumentChangeEvent } from 'vscode'
import CommitSenseRunner, {
    CommitSense,
    CommitSenseOptions,
} from '../../modules/CommitSenseRunner'
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
    protected static async intializeMakesInstallDir() {
        let passedPath: PathLike | undefined

        CommitSenseRunner.mkdir = async (dirPath: PathLike) => {
            passedPath = dirPath
        }

        await this.initialize()

        assert.isEqual(
            passedPath,
            this.defaultClonePath,
            'Did not call mkdir as expected!'
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
    protected static async initializeClonesIntoDefaultDirPath() {
        await this.initialize()

        assert.isEqualDeep(
            FakeAutocloner.callsToRun[0]?.dirPath,
            this.defaultClonePath,
            'Did not call run with expected dirPath!'
        )
    }

    @test()
    protected static async initializeClonesIntoPassedDirPath() {
        const instance = this.CommitSenseRunner({ installDir: this.installDir })

        await instance.initialize()

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
            '\n\nPlease call initialize() before start() on CommitSenseRunner!\n\n',
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

    private static readonly defaultClonePath =
        this.expandHomeDir('~/.commitsense')

    private static expandHomeDir(inputPath: string) {
        return inputPath.startsWith('~')
            ? path.join(os.homedir(), inputPath.slice(1))
            : inputPath
    }

    private static setFakeAutocloner() {
        GitAutocloner.Class = FakeAutocloner
        FakeAutocloner.resetTestDouble()
    }

    private static setFakeVscode() {
        // package.json jest moduleNameMapper handles this
        resetVscodeTestDoubles()
    }

    private static CommitSenseRunner(options?: Partial<CommitSenseOptions>) {
        return CommitSenseRunner.Create({
            gitUrls: this.gitUrls,
            ...options,
        })
    }
}
