import { Dirent } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'

export default class WorkspaceGraphEngine implements GraphEngine {
    public static Class?: GraphEngineConstructor
    public static readDir = readdir

    protected graph!: Record<string, Record<string, unknown>>

    private workspaceDir: string

    protected constructor(options: GraphEngineOptions) {
        const { workspaceDir } = options

        this.workspaceDir = workspaceDir
    }

    public static Create(options: GraphEngineOptions) {
        return new (this.Class ?? this)(options)
    }

    public async initialize() {
        this.graph = {}

        const packageNames = await this.readDir(this.workspaceDir)

        for (const packageName of packageNames) {
            this.graph[packageName] = {} as Record<string, unknown>

            const fullPath = path.join(this.workspaceDir, packageName)

            await this.walk(fullPath, async (dirent) => {
                if (dirent.isFile()) {
                    this.graph[packageName][dirent.name] = {}
                }
            })
        }
    }

    private async walk(
        dir: string,
        visitor: (dirent: Dirent) => Promise<void> | void
    ) {
        const entries = await this.readDir(dir, { withFileTypes: true })

        for (const entry of entries) {
            await visitor(entry)

            if (entry.isDirectory()) {
                const fullPath = path.join(dir, entry.name)
                await this.walk(fullPath, visitor)
            }
        }
    }

    private get readDir() {
        return WorkspaceGraphEngine.readDir
    }
}

export interface GraphEngine {
    initialize(): Promise<void>
}

export type GraphEngineConstructor = new (
    options: GraphEngineOptions
) => GraphEngine

export interface GraphEngineOptions {
    workspaceDir: string
}
