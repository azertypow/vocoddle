import positive from "./_francais_input_negative"
import negative from "./_francais_input_positive"
import {analyse, runAudio, startRecognition} from "./tools"
import {IAudioElements} from "./audioLoader"

declare class webkitSpeechRecognition      extends SpeechRecognition{}
declare class webkitSpeechGrammarList      extends SpeechGrammarList{}
declare class webkitSpeechRecognitionEvent extends SpeechRecognitionEvent{}

export function run(audioElementsByLevel: IAudioElements) {

  let recognition = new webkitSpeechRecognition() as SpeechRecognition;

  // const test = {...english}
  // recognition.lang = "en-US";
    const test = {...positive, ...negative}
    recognition.lang = "fr-FR";

    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    startRecognition(recognition)

    recognition.addEventListener("result", (ev: SpeechRecognitionEventMap["result"]) => {

      for (let i = 0; i < ev.results.length; i++) {

        const result = ev.results[i][0]

        const confidence = result.confidence
        const transcript = result.transcript.toLowerCase()

        console.log(ev)
        console.log(result)

        console.log("passé: \t", transcript)

        const score = analyse(test as any, transcript, elementDebueger)

        console.log(score)

        runAudio(score, audioElementsByLevel)
      }
    })

    recognition.addEventListener("end", () => {
      startRecognition(recognition)
    })

    const elementDebueger = document.createElement("div")
    elementDebueger.className = "r-debugguer"

    document.body.appendChild(elementDebueger)

  // recognition.addEventListener("audiostart",        () => console.log('audiostart'))
  // recognition.addEventListener("error",             () => console.log('error'))
  // recognition.addEventListener("nomatch",           () => console.log('nomatch'))
  // recognition.addEventListener("soundend",          () => console.log('soundend'))
  // recognition.addEventListener("soundstart",        () => console.log('soundstart'))
  // recognition.addEventListener("speechend",         () => console.log('speechend'))
  // recognition.addEventListener("speechstart",       () => console.log('speechstart'))
  // recognition.addEventListener("start",             () => console.log('start'))
}