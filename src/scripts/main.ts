import {getAudioFiles} from "./audioLoader"
import {run} from "./app"

getAudioFiles().then((audioElementsByLevel) => {
  run(audioElementsByLevel)
})
