import {generateAudioData, getListOfAudioFiles} from "./audioLoader"
import {runRecognitionApp} from "./app"
import {ListenStatus} from "./ListenStatus"
import {createObjectScene} from "./ObjectScene"

createObjectScene()

window.addEventListener("load", () => {

  let audioFileLoaderIsNotStarted = true

  let speachRecognitionIsNotStarting = true

  document.querySelector(".r-title")!.addEventListener("transitionend", (ev) => {



    if(audioFileLoaderIsNotStarted) {
      audioFileLoaderIsNotStarted = false
      getListOfAudioFiles().then( (listOfAudioFiles) => {

        document.querySelector(".anim-intro-to")!.classList.add("anim-intro-end")

        window.setTimeout(() => {
          document.querySelector(".current-page-is-0")!.classList.add("current-page-is-1")
        }, 1500)

        let listen = new ListenStatus(() => {
          console.log("change!!!")
        })

        // document.addEventListener("mousedown", () => {
        //   listen.active = false
        //   console.log("down")
        //   document.body.classList.add("listen-off")
        // })

        // document.addEventListener("mouseup", () => {
        //   listen.active = true
        //   console.log("up")
        //   document.body.classList.remove("listen-off")
        // })

        const audioData = generateAudioData(listOfAudioFiles)

        document.querySelector(".r-button-start")!.addEventListener("click", () => {
          document.querySelector(".current-page-is-0")!.classList.add("current-page-is-2")

          if (speachRecognitionIsNotStarting) runRecognitionApp(audioData, listen)
        })

      })
    }

  })

  document.querySelector(".anim-intro-from")!.classList.add("anim-intro-to")

})


function pageNavigation() {

}