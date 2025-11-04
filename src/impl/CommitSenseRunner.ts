import { mkdir } from 'fs/promises'
import os from 'os'
import path from 'path'
import { Autocloner, GitAutocloner } from '@neurodevs/meta-node'
import * as vscode from 'vscode'
import LiveEditPropagator, { EditPropagator } from './LiveEditPropagator.js'

export default class CommitSenseRunner implements CommitSense {
    public static Class?: CommitSenseConstructor
    public static mkdir = mkdir

    private gitUrls: string[]
    private installDir: string
    private autocloner: Autocloner
    private propagator: EditPropagator

    private initialized: boolean

    private readonly defaultClonePath = this.expandHomeDir('~/.commitsense')

    protected constructor(options: CommitSenseConstructorOptions) {
        const { gitUrls, installDir, autocloner, propagator } = options

        this.gitUrls = gitUrls
        this.installDir = installDir ?? this.defaultClonePath
        this.autocloner = autocloner
        this.propagator = propagator

        this.initialized = false
    }

    public static Create(options: CommitSenseOptions) {
        const autocloner = this.GitAutocloner()
        const propagator = this.LiveEditPropagator()

        return new (this.Class ?? this)({ ...options, autocloner, propagator })
    }

    public async initialize() {
        await this.mkdirForInstallDir()
        await this.cloneGitRepos()
        this.initialized = true
    }

    private async mkdirForInstallDir() {
        await this.mkdir(this.installDir, { recursive: true })
    }

    private async cloneGitRepos() {
        await this.autocloner.run({
            dirPath: this.installDir,
            urls: this.gitUrls,
        })
    }

    public async start() {
        this.throwIfNotInitialized()
        this.registerLiveEditWatcher()
    }

    private registerLiveEditWatcher() {
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            await this.onLiveEdit(event)
        })
    }

    private async onLiveEdit(event: vscode.TextDocumentChangeEvent) {
        await this.propagator.propagate(event)
    }

    private throwIfNotInitialized() {
        if (!this.initialized) {
            this.throwNotInitializedError()
        }
    }

    private throwNotInitializedError() {
        throw new Error(this.notInitializedError)
    }

    private readonly notInitializedError =
        '\n\nPlease call initialize() before start() on CommitSenseRunner!\n\n'

    private expandHomeDir(inputPath: string) {
        return inputPath.startsWith('~')
            ? path.join(os.homedir(), inputPath.slice(1))
            : inputPath
    }

    private get mkdir() {
        return CommitSenseRunner.mkdir
    }

    private static GitAutocloner() {
        return GitAutocloner.Create()
    }

    private static LiveEditPropagator() {
        return LiveEditPropagator.Create()
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
    installDir?: string
}

export interface CommitSenseConstructorOptions extends CommitSenseOptions {
    autocloner: Autocloner
    propagator: EditPropagator
}
