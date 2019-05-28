const express = require("express")
const fs = require("fs").promises
const path = require("path")

const PORT_LISTING = 3000
const AUDIO_DIRECTORY = "audio"

const app = express()

app.use('/static', express.static('api/public'));

app.get("/", (req, res, next) => {
    getFiles("api/public", AUDIO_DIRECTORY).then((arrayOfFiles) => {
        res.json(arrayOfFiles)
    })
})

app.listen(3000, () => {
    console.info(`api server run on port ${PORT_LISTING}`)
})

async function getFiles(publicDirectory, directory) {
    let listOfFilesPath = {}

    const entriesPath = publicDirectory + "/" + directory
    const entries = await fs.readdir(entriesPath)

    for(const entry of entries) {

        const entryPathRelativeToPublicDirectory = directory + "/" + entry

        const entryPath = publicDirectory + "/" + entryPathRelativeToPublicDirectory

        const entryStats = await fs.lstat(entryPath)

        if (entryStats.isFile() && entryPath.isWaveFile()) {
            listOfFilesPath[entry] = entryPathRelativeToPublicDirectory
        }
        else if (entryStats.isDirectory()) {
            listOfFilesPath[entry] = await getFiles(publicDirectory, entryPathRelativeToPublicDirectory)
        }
    }
    return listOfFilesPath
}

String.prototype.isWaveFile = function() {
    return path.extname(this.toString()) === ".wav"
}
