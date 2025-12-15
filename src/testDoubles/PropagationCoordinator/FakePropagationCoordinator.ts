import { PropagationCoordinator } from '../../impl/NpmPropagationCoordinator.js'

export default class FakePropagationCoordinator
    implements PropagationCoordinator
{
    public static callsToConstructor: {
        repoPath?: string
        repoPaths?: string[]
    }[] = []

    public constructor(repoPath?: string, repoPaths?: string[]) {
        FakePropagationCoordinator.callsToConstructor.push({
            repoPath,
            repoPaths,
        })
    }

    public static resetTestDouble() {
        FakePropagationCoordinator.callsToConstructor = []
    }
}
