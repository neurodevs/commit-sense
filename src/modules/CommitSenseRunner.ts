import { GitAutocloner } from '@neurodevs/meta-node'

export default class CommitSenseRunner implements CommitSense {
    public static Class?: CommitSenseConstructor

    protected constructor() {}

    public static Create() {
        this.GitAutocloner()
        return new (this.Class ?? this)()
    }

    private static GitAutocloner() {
        GitAutocloner.Create()
    }
}

export interface CommitSense {}

export type CommitSenseConstructor = new () => CommitSense
