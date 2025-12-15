export default class NpmPropagationCoordinator
    implements PropagationCoordinator
{
    public static Class?: PropagationCoordinatorConstructor

    protected constructor(_repoPath: string, _repoPaths: string[]) {}

    public static Create(repoPath: string, repoPaths: string[]) {
        return new (this.Class ?? this)(repoPath, repoPaths)
    }
}

export interface PropagationCoordinator {}

export type PropagationCoordinatorConstructor = new (
    repoPath: string,
    repoPaths: string[]
) => PropagationCoordinator
