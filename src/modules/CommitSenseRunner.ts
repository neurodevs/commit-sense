export default class CommitSenseRunner implements CommitSense {
    public static Class?: CommitSenseConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface CommitSense {}

export type CommitSenseConstructor = new () => CommitSense
