import FakeWorkspace from './FakeWorkspace.js'

export function resetVscodeTestDoubles() {
    FakeWorkspace.resetTestDouble()
}

export const workspace = new FakeWorkspace()

export default { workspace }
