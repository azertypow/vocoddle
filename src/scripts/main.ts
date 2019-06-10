import {generateAudioData, getListOfAudioFiles} from "./audioLoader"
import {runRecognitionApp} from "./app"
import {ListenStatus} from "./ListenStatus"

getListOfAudioFiles().then( (listOfAudioFiles) => {

  let listen = new ListenStatus(() => {
    console.log("change!!!")
  })

  document.addEventListener("mousedown", () => {
    listen.active = false
    console.log("down")
    document.body.classList.add("listen-off")
  })

  document.addEventListener("mouseup", () => {
    listen.active = true
    console.log("up")
    document.body.classList.remove("listen-off")
  })

  const audioData = generateAudioData(listOfAudioFiles)

  runRecognitionApp(audioData, listen)

})
