import positive from "./_francais_input_negative"
import negative from "./_francais_input_positive"
import {analyse, getLevelName, startRecognition} from "./tools"
import {IAudioData, LEVEL_NAMES} from "./audioLoader"
import {ListenStatus} from "./ListenStatus"
import {DebugInterface} from "./DebugInterface"
import {PizzicatoManager} from "./PizzicatoManager"

declare class webkitSpeechRecognition extends SpeechRecognition{}

export function runRecognitionApp(audioData: IAudioData, listen: ListenStatus) {

  let recognition = new webkitSpeechRecognition() as SpeechRecognition;

  const positiveAndNegativeWordsList: {[key: string]: number} = {...positive, ...negative}
  recognition.lang = "fr-FR";

  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  startRecognition(recognition)

  const debugInterface = new DebugInterface()

  // const audioManager = new AudioManager(audioData)

  const pizzicatoManager = new PizzicatoManager(audioData, "http://localhost:3000/static/")

  pizzicatoManager.loadAudioFiles().then(() => {

    recognition.addEventListener("result", (ev: SpeechRecognitionEventMap["result"]) => {

      console.log(listen.active)

      if(listen.active) {
        for (let i = 0; i < ev.results.length; i++) {

          const result = ev.results[i][0]

          const confidence = result.confidence
          const transcript = result.transcript.toLowerCase()

          console.log(ev)
          console.log(result)

          console.log("passé: \t", transcript)

          const score = analyse(positiveAndNegativeWordsList, transcript)

          console.log(score.scoreOfEntierDiscution)

          // runAudio(score.scoreOfEntierDiscution, audioData)

          // audioManager.playSound(LEVEL_NAMES.LEVEL_1)

          const levelName = getLevelName(score.scoreOfEntierDiscution)

          console.log(levelName)

          pizzicatoManager.playLevel(levelName, score.scoreOfEntierDiscution)

          debugInterface.setAnalyseResponseView(score)
        }
      }

    })

    recognition.addEventListener("end", () => {
      startRecognition(recognition)
    })

    let scoreSimulation = 0

    // document.addEventListener("click", (ev) => {
    //
    //   const incrementation = ev.altKey ? .2 : .5
    //
    //   if(ev.shiftKey) scoreSimulation += incrementation
    //   else scoreSimulation -= incrementation
    //
    //   console.log(scoreSimulation)
    //
    //   pizzicatoManager.playLevel(getLevelName(scoreSimulation), scoreSimulation)
    // })

  })
}
