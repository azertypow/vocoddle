import {generateAudioData, getListOfAudioFiles} from "./audioLoader"
import {runRecognitionApp} from "./app"
import {ListenStatus} from "./ListenStatus"
import {ObjectScene} from "./ObjectScene"

// createObjectScene()

const babylonScene = new ObjectScene()
let audioFileLoaderIsNotStarted = true
let speachRecognitionIsNotStarting = true

window.addEventListener("load", () => {



  document.querySelector(".r-title")!.addEventListener("transitionend", (ev) => {

    window.setTimeout(() => {
      startApplication()
    }, 2500)

  })

  document.querySelector(".anim-intro-from")!.classList.add("anim-intro-to")

})


function startApplication() {

  if(audioFileLoaderIsNotStarted) {
    audioFileLoaderIsNotStarted = false
    getListOfAudioFiles().then( (listOfAudioFiles) => {

      document.querySelector(".current-page-is-0")!.classList.add("list-of-audio-files-loaded")

      document.querySelector(".r-button-skip-intro")!.addEventListener("click", () => {



        document.querySelector(".anim-intro-to")!.classList.add("anim-intro-end")

        // window.setTimeout(() => {
          babylonScene.startMoveToLeftAnimation()
        // }, 250)

        window.setTimeout(() => {
          document.querySelector(".current-page-is-0")!.classList.add("current-page-is-1")
        }, 500)

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

          babylonScene.startHeaderEntryAnimation()

          if (speachRecognitionIsNotStarting) runRecognitionApp(audioData, listen, babylonScene)
        })



      })


    })
  }

}

const allReloaderApp = document.querySelectorAll(".r-reloader-app")

allReloaderApp.forEach(reloaderElement => {
  if(reloaderElement instanceof HTMLElement) {
    reloaderElement.addEventListener("click", () => {document.location.reload(true);})
  }
})