import { readFile } from 'node:fs/promises'
import { NpmReleasePropagator } from '@neurodevs/meta-node'

export default class NpmPropagationCoordinator
    implements PropagationCoordinator
{
    public static Class?: PropagationCoordinatorConstructor
    public static readFile = readFile

    private repoPath: string
    private repoPaths: string[]

    protected constructor(repoPath: string, repoPaths: string[]) {
        this.repoPath = repoPath
        this.repoPaths = repoPaths
    }

    public async run() {
        const packageVersion = await this.getPackageVersion()

        const targetRepoPaths: string[] = []

        for (const repoPath of this.repoPaths) {
            const pkgJson = await this.readFile(
                `${repoPath}/package.json`,
                'utf-8'
            )
            const pkg = JSON.parse(pkgJson)

            if (
                pkg.dependencies?.[this.repoPath] ??
                pkg.devDependencies?.[this.repoPath]
            ) {
                targetRepoPaths.push(repoPath)
            }
        }

        const propagator = NpmReleasePropagator.Create({
            packageName: this.repoPath.split('/').pop() ?? '',
            packageVersion,
            repoPaths: targetRepoPaths,
        })

        await propagator.run()
    }

    public static Create(repoPath: string, repoPaths: string[]) {
        return new (this.Class ?? this)(repoPath, repoPaths)
    }

    private async getPackageVersion() {
        const pkgJson = await this.readFile(this.pkgJsonPath, 'utf-8')
        return JSON.parse(pkgJson)?.version as string
    }

    private get pkgJsonPath() {
        return `${this.repoPath}/package.json`
    }

    private get readFile() {
        return NpmPropagationCoordinator.readFile
    }
}

export interface PropagationCoordinator {
    run(): Promise<void>
}

export type PropagationCoordinatorConstructor = new (
    repoPath: string,
    repoPaths: string[]
) => PropagationCoordinator
