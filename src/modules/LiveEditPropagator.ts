
            export default class LiveEditPropagator implements EditPropagator {
                public static Class?: EditPropagatorConstructor
                
                protected constructor() {}
                
                public static Create() {
                    return new (this.Class ?? this)()
                }
            }

            export interface EditPropagator {}

            export type EditPropagatorConstructor = new () => EditPropagator
        