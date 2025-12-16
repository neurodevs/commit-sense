import { readFile } from 'node:fs/promises'
import {
    NpmReleasePropagator,
    ReleasePropagatorOptions,
} from '@neurodevs/meta-node'

export default class NpmPropagationCoordinator
    implements PropagationCoordinator
{
    public static Class?: PropagationCoordinatorConstructor
    public static readFile = readFile

    private repoPath: string
    private repoPaths: string[]

    private currentRepoPath!: string
    private currentPkg!: PackageJson

    protected constructor(repoPath: string, repoPaths: string[]) {
        this.repoPath = repoPath
        this.repoPaths = repoPaths
    }

    public static Create(repoPath: string, repoPaths: string[]) {
        return new (this.Class ?? this)(repoPath, repoPaths)
    }

    public async run() {
        const packageName = this.repoPath.split('/').pop()!
        const packageVersion = await this.getPackageVersion()
        const repoPaths = await this.determineReposForPropagation()

        const propagator = this.NpmReleaseCoordinator({
            packageName,
            packageVersion,
            repoPaths,
        })

        await propagator.run()
    }

    private async getPackageVersion() {
        const pkgJson = await this.readFile(
            `${this.repoPath}/package.json`,
            'utf-8'
        )
        return JSON.parse(pkgJson)?.version as string
    }

    private async determineReposForPropagation() {
        const repoPaths: string[] = []

        for (const repoPath of this.repoPaths) {
            this.currentRepoPath = repoPath
            this.currentPkg = await this.loadPkgJson()

            if (this.isDependency ?? this.isDevDependency) {
                repoPaths.push(repoPath)
            }
        }
        return repoPaths
    }

    private get isDependency() {
        return this.currentPkg?.dependencies?.[this.repoPath]
    }

    private get isDevDependency() {
        return this.currentPkg?.devDependencies?.[this.repoPath]
    }

    private async loadPkgJson() {
        const pkgJson = await this.readFile(
            `${this.currentRepoPath}/package.json`,
            'utf-8'
        )
        return JSON.parse(pkgJson)
    }

    private get readFile() {
        return NpmPropagationCoordinator.readFile
    }

    private NpmReleaseCoordinator(options: ReleasePropagatorOptions) {
        return NpmReleasePropagator.Create(options)
    }
}

export interface PropagationCoordinator {
    run(): Promise<void>
}

export type PropagationCoordinatorConstructor = new (
    repoPath: string,
    repoPaths: string[]
) => PropagationCoordinator

export interface PackageJson {
    version?: string
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
}
