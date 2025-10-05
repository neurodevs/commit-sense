import { Autocloner, GitAutocloner } from '@neurodevs/meta-node'
import * as vscode from 'vscode'

export default class CommitSenseRunner implements CommitSense {
    public static Class?: CommitSenseConstructor
    public static vscode = vscode

    private autocloner: Autocloner
    private gitUrls: string[]
    private installDir: string
    private initialized: boolean

    protected constructor(options: CommitSenseConstructorOptions) {
        const { autocloner, gitUrls, installDir } = options

        this.autocloner = autocloner
        this.gitUrls = gitUrls
        this.installDir = installDir

        this.initialized = false
    }

    public static Create(options: CommitSenseOptions) {
        const autocloner = this.GitAutocloner()
        return new (this.Class ?? this)({ autocloner, ...options })
    }

    public async initialize() {
        await this.cloneGitRepos()
        this.initialized = true
    }

    private async cloneGitRepos() {
        await this.autocloner.run({
            urls: this.gitUrls,
            dirPath: this.installDir,
        })
    }

    public async start() {
        this.throwIfNotInitialized()
        this.registerLiveEditWatcher()
    }

    private registerLiveEditWatcher() {
        vscode.workspace.onDidChangeTextDocument(async (_event) => {
            await this.onLiveEdit()
        })
    }

    private async onLiveEdit() {}

    private throwIfNotInitialized() {
        if (!this.initialized) {
            this.throwNotInitializedError()
        }
    }

    private throwNotInitializedError() {
        throw new Error('Please call initialize() before start()!')
    }

    private static GitAutocloner() {
        return GitAutocloner.Create()
    }
}

export interface CommitSense {
    initialize(): Promise<void>
    start(): Promise<void>
}

export type CommitSenseConstructor = new (
    options: CommitSenseConstructorOptions
) => CommitSense

export interface CommitSenseOptions {
    gitUrls: string[]
    installDir: string
}

export interface CommitSenseConstructorOptions extends CommitSenseOptions {
    autocloner: Autocloner
}
