require('module-alias/register')

import { mkdir } from 'fs/promises'
import os from 'os'
import path from 'path'
import { Autocloner, GitAutocloner } from '@neurodevs/meta-node'
import * as vscode from 'vscode'

export default class CommitSenseRunner implements CommitSense {
    public static Class?: CommitSenseConstructor
    public static mkdir = mkdir

    private gitUrls: string[]
    private installDir: string
    private autocloner: Autocloner

    private initialized: boolean

    private readonly defaultClonePath = this.expandHomeDir('~/.commitsense')

    protected constructor(options: CommitSenseConstructorOptions) {
        const { gitUrls, installDir, autocloner } = options

        this.gitUrls = gitUrls
        this.installDir = installDir ?? this.defaultClonePath
        this.autocloner = autocloner

        this.initialized = false
    }

    public static Create(options: CommitSenseOptions) {
        const autocloner = this.GitAutocloner()
        return new (this.Class ?? this)({ ...options, autocloner })
    }

    public async initialize() {
        await this.mkdirForInstall()
        await this.cloneGitRepos()
        this.initialized = true
    }

    private async mkdirForInstall() {
        await CommitSenseRunner.mkdir(this.installDir)
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
        vscode.workspace.onDidChangeTextDocument(async (_event) => {
            await this.onLiveEdit(_event)
        })
    }

    private async onLiveEdit(event: any) {
        console.log(event)
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
    installDir?: string
}

export interface CommitSenseConstructorOptions extends CommitSenseOptions {
    autocloner: Autocloner
}
