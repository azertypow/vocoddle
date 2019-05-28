import {getAudioFiles} from "./audioLoader"
import {run} from "./app"

getAudioFiles().then((value) => {
  run(value)
})
