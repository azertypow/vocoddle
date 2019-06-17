import {IAudioData, LEVEL_NAMES} from "./audioLoader"

declare class webkitSpeechRecognition      extends SpeechRecognition{}

export function startRecognition(speechRecognition :webkitSpeechRecognition) {
  console.log("recognition start")
  speechRecognition.start()
}

function getSum(total: number, num: number) {
  return total + num
}

let arrayOfAllScoreOfText: number[] = []
let scoreOfText      = 0

export function analyse(afinn: {[key: string]: number}, textToAnalyse: string): IAnalyseResponse {
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
  
  const scoreOfEntierDiscution                  = sumOfAllScoredOfText / (arrayOfAllScoreOfText.length ? arrayOfAllScoreOfText.length : 1)
  const scoreOfEntierDiscution_testDivisionFix  = sumOfAllScoredOfText / 2

  return {
    scoreOfEntierDiscution,
    info: {
      scoreOfEntierDiscution_testDivisionFix,
      score_total_des_mots:                           totalOfWordsScoreInTextToAnalyse,
      moyenne_avec_l_ensemble_des_mots:               totalOfWordsScoreInTextToAnalyse / words.length,
      moyenne_avec_seulement_les_mots_qui_on_matche:  scoreOfText,
      list_des_mots_qui_ont_matche_avec_leur_score:   arrayOfScoredWordsInfo,
      score_du_text_entrant:                          scoreOfText,
      score_de_la_discution:                          scoreOfEntierDiscution,
    }
  }
}

export interface IAnalyseResponse {
  scoreOfEntierDiscution: number;
  info: {
    scoreOfEntierDiscution_testDivisionFix: number,
    moyenne_avec_seulement_les_mots_qui_on_matche: number;
    score_total_des_mots: number;
    moyenne_avec_l_ensemble_des_mots: number;
    score_de_la_discution: number;
    score_du_text_entrant: number;
    list_des_mots_qui_ont_matche_avec_leur_score: {
      word: string;
      value: number
    }[]
  }
}

export function getLevelName(score: number): LEVEL_NAMES {

  const levelValue = {
    0: 0,
    "-1": -1,
    "-2": -2,
    "-3": -3,
    "-4": -4,
    "-5": -5,
  }

  switch(true) {
    case ( levelValue["-1"] <= score && score < levelValue["0"]  )  : return LEVEL_NAMES.LEVEL_1
    case ( levelValue["-2"] <= score && score < levelValue["-1"]  ) : return LEVEL_NAMES.LEVEL_2
    case ( levelValue["-3"] <= score && score < levelValue["-2"]  ) : return LEVEL_NAMES.LEVEL_3
    case ( levelValue["-4"] <= score && score < levelValue["-3"]  ) : return LEVEL_NAMES.LEVEL_4
    case ( levelValue["-5"] <= score && score < levelValue["-4"]  ) : return LEVEL_NAMES.LEVEL_4 // todo remode -5 from score files
    default                                                         : return LEVEL_NAMES.LEVEL_0
  }
}


export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * todo
 */

let audioIsNotPlaying = true

function audioPlay(level: LEVEL_NAMES, audioData: IAudioData) {

}

