import {EntriesName, IAudioElements} from "./audioLoader"

declare class webkitSpeechRecognition      extends SpeechRecognition{}
declare class webkitSpeechGrammarList      extends SpeechGrammarList{}
declare class webkitSpeechRecognitionEvent extends SpeechRecognitionEvent{}

export function startRecognition(speechRecognition :webkitSpeechRecognition) {
  console.log("recognition start")
  speechRecognition.start()
}

function getSum(total: number, num: number) {
  return total + num
}

let arrayOfAllScoreOfText: number[] = []
let scoreOfText      = 0

export function analyse(afinn: {[key: string]: number}, textToAnalyse: string, elementDebueger: HTMLElement) {
  let words = textToAnalyse.split(/\s/)

  let arrayOfScoredWordsInfo: {word: string, value: number}[] = []

  let totalOfWordsScoreInTextToAnalyse = 0

  for (let i = 0; i < words.length; i++) {
    
    let word = words[i].toLowerCase()
    
    if (afinn.hasOwnProperty(word)) {
      
      let scoreOfWord = afinn[word]

      totalOfWordsScoreInTextToAnalyse += Number(scoreOfWord)

      arrayOfScoredWordsInfo.push({word: word, value: scoreOfWord})
    }
  }

  scoreOfText = totalOfWordsScoreInTextToAnalyse / (arrayOfScoredWordsInfo.length ? arrayOfScoredWordsInfo.length : 1)
  arrayOfAllScoreOfText.push(scoreOfText)

  const sumOfAllScoredOfText = arrayOfAllScoreOfText.reduce(getSum)
  
  const scoreOfEntierDiscution = sumOfAllScoredOfText / (arrayOfAllScoreOfText.length ? arrayOfAllScoreOfText.length : 1)

  elementDebueger.innerHTML = `
  <h1>score total des mots:        ${totalOfWordsScoreInTextToAnalyse}</h1>
  <h1>moyenne avec l'ensemble des mots:  ${totalOfWordsScoreInTextToAnalyse / words.length}</h1>
  <h1>moyenne avec selement les mots qui on matché:  ${scoreOfText}</h1>
  <h1>scoredwords:  ${arrayOfScoredWordsInfo}</h1>
  <h1>score du text entrant: ${scoreOfText}</h1>
  <h1>score de la discution (moyenne des scores de text): ${scoreOfEntierDiscution}</h1>
  `

  return scoreOfEntierDiscution
}

export function runAudio(score: Number, audioElements: IAudioElements) {

  const levelValue = {
    0: 0,
    "-1": -1,
    "-2": -2,
    "-3": -3,
    "-4": -4,
    "-5": -5,
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
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
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

