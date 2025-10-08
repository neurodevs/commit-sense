import CommitSenseRunner from '../modules/CommitSenseRunner'

async function main() {
    const runner = CommitSenseRunner.Create({
        installDir: '/Users/ericthecurious/commitsense',
        gitUrls: [
            'https://github.com/neurodevs/node-lsl.git',
            'https://github.com/neurodevs/node-ble.git',
            'https://github.com/neurodevs/node-xdf.git',
            'https://github.com/neurodevs/node-biosensors.git',
        ],
    })

    await runner.initialize()
    await runner.start()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
