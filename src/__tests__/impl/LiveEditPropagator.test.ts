import AbstractModuleTest, { test, assert } from '@neurodevs/node-tdd'

import LiveEditPropagator, {
    EditPropagator,
} from '../../impl/LiveEditPropagator.js'

export default class LiveEditPropagatorTest extends AbstractModuleTest {
    private static instance: EditPropagator

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.LiveEditPropagator()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    private static LiveEditPropagator() {
        return LiveEditPropagator.Create()
    }
}
