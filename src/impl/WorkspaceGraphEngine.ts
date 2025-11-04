import { Dirent } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'

export default class WorkspaceGraphEngine implements GraphEngine {
    public static Class?: GraphEngineConstructor
    public static readDir = readdir

    protected graph!: Record<string, unknown>

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

        await this.walk(this.workspaceDir, async (dirent) => {
            if (dirent.isDirectory()) {
                this.graph[dirent.name] = {}
            }
        })
    }

    private async walk(
        dir: string,
        visitor: (dirent: Dirent) => Promise<void> | void
    ) {
        const entries = await this.readDir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const entryPath = path.join(dir, entry.name)
            await visitor(entry)

            if (entry.isDirectory()) {
                await this.walk(entryPath, visitor)
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
