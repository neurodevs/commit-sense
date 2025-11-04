export default class WorkspaceGraphEngine implements GraphEngine {
    public static Class?: GraphEngineConstructor

    protected graph!: Record<string, unknown>

    protected constructor(_options: GraphEngineOptions) {}

    public static Create(options: GraphEngineOptions) {
        return new (this.Class ?? this)(options)
    }

    public async initialize() {
        this.graph = {}
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
