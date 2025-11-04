export default class WorkspaceGraphEngine implements GraphEngine {
    public static Class?: GraphEngineConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface GraphEngine {}

export type GraphEngineConstructor = new () => GraphEngine
