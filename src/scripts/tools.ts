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

export function runAudio(score: Number, data: any) {
  // switch(true) {
  //   case ( score.isBetween(0, 1) ):
  //     audioPlay()
  //   case -4:
  //   case -3:
  //   case -2:
  //   case -1:
  // }
}


function getRandom() {

}

function audioPlay() {

}