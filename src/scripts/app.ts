import positive from "./francais_input_negative"
import negative from "./francais_input_positive"
import {analyse, runAudio, startRecognition} from "./tools"

declare class webkitSpeechRecognition      extends SpeechRecognition{}
declare class webkitSpeechGrammarList      extends SpeechGrammarList{}
declare class webkitSpeechRecognitionEvent extends SpeechRecognitionEvent{}

export function run(audioData: {[key: string]: HTMLAudioElement[]}) {

  let recognition = new webkitSpeechRecognition() as SpeechRecognition;

  // const test = {...english}
  // recognition.lang = "en-US";
    const test = {...positive, ...negative}
    recognition.lang = "fr-FR";

    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 5

    startRecognition(recognition)

    let stringToTest = ""

    recognition.addEventListener("result", (ev: SpeechRecognitionEventMap["result"]) => {

      for (let i = 0; i < ev.results.length; i++) {

        const result = ev.results[i][0]

        const confidence = result.confidence
        const transcript = result.transcript.toLowerCase()

        if(confidence > 0.75) {
          console.log("passé: \t", transcript)
          stringToTest = transcript
        } else {
          console.log("pas passé: \t", transcript)
        }
      }

      // speechRecognition.stop()
    })

    recognition.addEventListener("end", () => {
      stringToTest = ""

      startRecognition(recognition)
    })

    const elementDebueger = document.createElement("div")

    document.body.appendChild(elementDebueger)

    recognition.addEventListener("audioend", (ev: SpeechRecognitionEventMap["audioend"]) => {
      console.log("audio end")

      const score = analyse(test as any, stringToTest, elementDebueger)

      console.log("score")
      console.log(score)

      runAudio(score, audioData)
    })

  // recognition.addEventListener("audiostart",        () => console.log('audiostart'))
  // recognition.addEventListener("error",             () => console.log('error'))
  // recognition.addEventListener("nomatch",           () => console.log('nomatch'))
  // recognition.addEventListener("soundend",          () => console.log('soundend'))
  // recognition.addEventListener("soundstart",        () => console.log('soundstart'))
  // recognition.addEventListener("speechend",         () => console.log('speechend'))
  // recognition.addEventListener("speechstart",       () => console.log('speechstart'))
  // recognition.addEventListener("start",             () => console.log('start'))
}