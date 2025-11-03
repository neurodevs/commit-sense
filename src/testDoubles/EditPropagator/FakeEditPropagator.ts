import { EditPropagator } from '../../impl/LiveEditPropagator.js'

export default class FakeEditPropagator implements EditPropagator {
    public static numCallsToConstructor = 0

    public constructor() {
        FakeEditPropagator.numCallsToConstructor++
    }

    public static resetTestDouble() {
        FakeEditPropagator.numCallsToConstructor = 0
    }
}
