import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import LiveEditPropagator, {
    EditPropagator,
} from '../../modules/LiveEditPropagator'

export default class LiveEditPropagatorTest extends AbstractSpruceTest {
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
