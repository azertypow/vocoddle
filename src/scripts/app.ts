import positive from "./_francais_input_negative"
import negative from "./_francais_input_positive"
import {analyse, runAudio, startRecognition} from "./tools"
import {IAudioData} from "./audioLoader"
import {ListenStatus} from "./ListenStatus"
import {DebugInterface} from "./DebugInterface"

declare class webkitSpeechRecognition extends SpeechRecognition{}

export function run(audioData: IAudioData, listen: ListenStatus) {

  let recognition = new webkitSpeechRecognition() as SpeechRecognition;

  const positiveAndNegativeWordsList: {[key: string]: number} = {...positive, ...negative}
  recognition.lang = "fr-FR";

  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  startRecognition(recognition)

  const debugInterface = new DebugInterface()

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

        runAudio(score.scoreOfEntierDiscution, audioData)

        debugInterface.setAnalyseResponseView(score)
      }
    }

  })

  recognition.addEventListener("end", () => {
    startRecognition(recognition)
  })
}
