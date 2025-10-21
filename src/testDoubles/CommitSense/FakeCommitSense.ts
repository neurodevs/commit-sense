import {
    CommitSense,
    CommitSenseConstructorOptions,
} from '../../impl/CommitSenseRunner'

export default class FakeCommitSense implements CommitSense {
    public static callsToConstructor: (
        | CommitSenseConstructorOptions
        | undefined
    )[] = []

    public static numCallsToInitialize = 0
    public static numCallsToStart = 0

    public constructor(options?: CommitSenseConstructorOptions) {
        FakeCommitSense.callsToConstructor.push(options)
    }

    public async initialize() {
        FakeCommitSense.numCallsToInitialize++
    }

    public async start() {
        FakeCommitSense.numCallsToStart++
    }

    public static resetTestDouble() {
        this.callsToConstructor = []
        this.numCallsToInitialize = 0
        this.numCallsToStart = 0
    }
}
