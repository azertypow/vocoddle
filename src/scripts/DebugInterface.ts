import {IAnalyseResponse} from "./tools"

export class DebugInterface {
  private _elementDebueger = document.createElement("div")

  private _score                                           = this.createDivElement()
  private _moyenne_avec_l_ensemble_des_mots                = this.createDivElement()
  private _moyenne_avec_seulement_les_mots_qui_on_matche   = this.createDivElement()
  private _score_de_la_discution                           = this.createDivElement()
  private _score_du_text_entrant                           = this.createDivElement()
  private _score_total_des_mots                            = this.createDivElement()
  private _list_des_mots_qui_ont_matche_avec_leur_score    = this.createDivElement()

  constructor() {
    this._elementDebueger.className = "r-debugguer"

    document.body.appendChild(this._elementDebueger)
  }

  setAnalyseResponseView(analyseResponse: IAnalyseResponse) {
    this._score.innerText =                                         `score :                                          ${analyseResponse.scoreOfEntierDiscution}`
    this._moyenne_avec_l_ensemble_des_mots.innerText =              `moyenne_avec_l_ensemble_des_mots :               ${analyseResponse.info.moyenne_avec_l_ensemble_des_mots}`
    this._moyenne_avec_seulement_les_mots_qui_on_matche.innerText = `moyenne_avec_seulement_les_mots_qui_on_matche :  ${analyseResponse.info.moyenne_avec_seulement_les_mots_qui_on_matche}`
    this._score_de_la_discution.innerText =                         `score_de_la_discution :                          ${analyseResponse.info.score_de_la_discution}`
    this._score_du_text_entrant.innerText =                         `score_du_text_entrant :                          ${analyseResponse.info.score_du_text_entrant}`
    this._score_total_des_mots.innerText =                          `score_total_des_mots :                           ${analyseResponse.info.score_total_des_mots}`
    this._list_des_mots_qui_ont_matche_avec_leur_score.innerText =  `list_des_mots_qui_ont_matche_avec_leur_score:    ${DebugInterface._generateStringOfWordMatchedInfo(analyseResponse.info.list_des_mots_qui_ont_matche_avec_leur_score)}`
  }

  private createDivElement() {
    const element = document.createElement("div")
    this._elementDebueger.appendChild(element)

    return element
  }

  private static _generateStringOfWordMatchedInfo(list_des_mots_qui_ont_matche_avec_leur_score: {word: string, value: number}[]) {
    let stringOfWordMatchedInfo = ""

    for(const wordsMatchedinfo of list_des_mots_qui_ont_matche_avec_leur_score) {
      stringOfWordMatchedInfo += `${wordsMatchedinfo.word} : ${wordsMatchedinfo.value} `
    }

    return stringOfWordMatchedInfo
  }
}