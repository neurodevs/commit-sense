// CommitSense

export { default as CommitSenseRunner } from './modules/CommitSenseRunner'
export * from './modules/CommitSenseRunner'

export { default as FakeCommitSense } from './testDoubles/CommitSense/FakeCommitSense'
export * from './testDoubles/CommitSense/FakeCommitSense'

// EditPropagator

export { default as LiveEditPropagator } from './modules/LiveEditPropagator'
export * from './modules/LiveEditPropagator'

// vscode

export * from './extensions'

export { default as fakeVscode } from './testDoubles/vscode/fakeVscode'
export * from './testDoubles/vscode/fakeVscode'

export { default as FakeWorkspace } from './testDoubles/vscode/FakeWorkspace'
export * from './testDoubles/vscode/FakeWorkspace'
