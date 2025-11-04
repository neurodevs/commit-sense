import WorkspaceGraphEngine, {
    GraphEngineOptions,
} from '../../impl/WorkspaceGraphEngine.js'

export default class SpyWorkspaceGraphEngine extends WorkspaceGraphEngine {
    public constructor(options: GraphEngineOptions) {
        super(options)
    }

    public getGraph() {
        return this.graph
    }
}
