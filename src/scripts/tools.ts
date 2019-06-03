import {EntriesName, IAudioElements} from "./audioLoader"

declare class webkitSpeechRecognition      extends SpeechRecognition{}
declare class webkitSpeechGrammarList      extends SpeechGrammarList{}
declare class webkitSpeechRecognitionEvent extends SpeechRecognitionEvent{}

export function startRecognition(speechRecognition :webkitSpeechRecognition) {
  console.log("recognition start")
  speechRecognition.start()
}

function getSum(total: number, num: number) {
  return total + num;
}

let total_notre_score: number[] = []
let notre_calcul      = 0

export function analyse(afinn: {[key: string]: number}, textToAnalyse: string, elementDebueger: HTMLElement) {
  let words = textToAnalyse.split(/\s/);

  // console.log("analyse")
  // console.log(words)
  // console.log("=====")

  let scoredwords = [];

  let totalScore = 0;

  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase();
    if (afinn.hasOwnProperty(word)) {
      let score = afinn[word];

      totalScore += Number(score);

      scoredwords.push(word + ': ' + score + ' ');
    }
  }

  notre_calcul = totalScore / (scoredwords.length ? scoredwords.length : 1)
  total_notre_score.push(notre_calcul)

  const notre_calcul_moyen = total_notre_score.reduce(getSum) / (total_notre_score.length ? total_notre_score.length : 1)

  elementDebueger.innerHTML = `
  <h1>score:        ${totalScore}</h1>
  <h1>comparative:  ${totalScore / words.length}</h1>
  <h1>scoredwords:  ${scoredwords}</h1>
  <h1>notre_calcul: ${notre_calcul}</h1>
  <h1>notre_calcul total: ${notre_calcul_moyen}</h1>
  `

  return notre_calcul_moyen
}

export function runAudio(score: Number, audioElements: IAudioElements) {

  const levelValue = {
    0: 0.0,
    "-1": -0.2,
    "-2": -0.4,
    "-3": -0.6,
    "-4": -0.8,
    "-5": -1,
  }

  switch(true) {
    case ( levelValue["-1"] <= score && score < levelValue["0"]  ):
      audioPlay("Niveau_-1", audioElements)
      break
    case ( levelValue["-2"] <= score && score < levelValue["-1"]  ):
      audioPlay("Niveau_-2", audioElements)
      break
    case ( levelValue["-3"] <= score && score < levelValue["-2"]  ):
      audioPlay("Niveau_-3", audioElements)
      break
    case ( levelValue["-4"] <= score && score < levelValue["-3"]  ):
      audioPlay("Niveau_-4", audioElements)
      break
    case ( levelValue["-5"] <= score && score < levelValue["-4"]  ):
      audioPlay("Niveau_-5", audioElements)
  }
}


function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

let audioIsntPlaying = true

function audioPlay(entriesName: EntriesName, audioElement: IAudioElements) {
  console.log(entriesName)
  console.log(audioElement[entriesName])

  const audioInCategory = audioElement[entriesName]

  const audioEndedListener = () => {
    console.log("ended")
    audioIsntPlaying = true
    removeListener()
  }

  const randomEntry = getRandomInt(0, audioInCategory.length)

  if(audioIsntPlaying && audioInCategory.length) {

    audioIsntPlaying = false


    audioInCategory[randomEntry].addEventListener("ended", audioEndedListener)


    console.log(randomEntry)

    audioInCategory[randomEntry].play().then(() => {console.log("PLAYYYY")})
  }

  function removeListener() {
    audioInCategory[randomEntry].removeEventListener("ended", audioEndedListener)
  }
}

