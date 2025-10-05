import { Autocloner, GitAutocloner } from '@neurodevs/meta-node'

export default class CommitSenseRunner implements CommitSense {
    public static Class?: CommitSenseConstructor

    private autocloner: Autocloner
    private gitUrls: string[]

    protected constructor(options: CommitSenseConstructorOptions) {
        const { autocloner, gitUrls } = options

        this.autocloner = autocloner
        this.gitUrls = gitUrls
    }

    public static Create(options: CommitSenseOptions) {
        const autocloner = this.GitAutocloner()
        return new (this.Class ?? this)({ autocloner, ...options })
    }

    public async initialize() {
        await this.cloneGitRepos()
    }

    private async cloneGitRepos() {
        await this.autocloner.run({
            urls: this.gitUrls,
            dirPath: '',
        })
    }

    private static GitAutocloner() {
        return GitAutocloner.Create()
    }
}

export interface CommitSense {
    initialize(): Promise<void>
}

export type CommitSenseConstructor = new (
    options: CommitSenseConstructorOptions
) => CommitSense

export interface CommitSenseOptions {
    gitUrls: string[]
}

export interface CommitSenseConstructorOptions extends CommitSenseOptions {
    autocloner: Autocloner
}
