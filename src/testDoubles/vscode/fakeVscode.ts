import FakeWorkspace from './FakeWorkspace'

export function resetVscodeTestDoubles() {
    FakeWorkspace.resetTestDouble()
}

export const workspace = new FakeWorkspace()

export default { workspace }
