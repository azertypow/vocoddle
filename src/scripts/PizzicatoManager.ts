import Pizzicato, {Sound} from "Pizzicato"
import {IAudioData, LEVEL_NAMES} from "./audioLoader"
import {getRandomInt} from "./tools"

export class PizzicatoManager {

  readonly effects = {

    pingPongDelay: new Pizzicato.Effects.PingPongDelay({
      feedback: 0.6,
      time: 0.4,
      mix: 0.5
    }),

    pingPongDelayIntensity_2: new Pizzicato.Effects.PingPongDelay({
      feedback: 0.4,
      time: 0.2,
      mix: 1
    }),

    lowPassFilter: new Pizzicato.Effects.LowPassFilter({
      frequency: 500,
      peak: 0
    }),

  }

  private _listOfSound: {[name: string]: Sound} = {}

  private _soundLoadedInfo: {readonly numberOfSoundToLoad: number, numberOfSoundLoaded: number, allIsLoaded: ()=>boolean}

  constructor(private readonly AUDIO_DATA: IAudioData, private readonly BASE_URL: string) {

    console.log(AUDIO_DATA)

    this._soundLoadedInfo = {
      allIsLoaded: () => {return this._soundLoadedInfo.numberOfSoundLoaded === this._soundLoadedInfo.numberOfSoundToLoad},
      numberOfSoundLoaded: 0,
      numberOfSoundToLoad: Object.keys(this.AUDIO_DATA.listOfSoundFilesUrl).length,
    }

    // this.loadAudioFiles().then(() => {
    //
    //   const nameOfAudioFile = this.AUDIO_DATA.listOfAudioFilesNameByLevel["Niveau_-1"][0]
    //   const sound = this._listOfSound[nameOfAudioFile]
    //
    //   sound.addEffect(this.effects.pingPongDelay)
    //   sound.addEffect(this.effects.lowPassFilter)
    //
    //   console.log(sound)
    //
    //   sound.play()
    //
    // })

    /**
     * level 2 test
     * */
    // var sound = new Pizzicato.Sound(AUDIO_DATA.listOfSoundFilesUrl["Niveau_-1_Accident.wav"], function() {
    //   // acousticGuitar.play();
    //   var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
    //     feedback: 0.6,
    //     time: 0.4,
    //     mix: 0.5
    //   });
    //
    //   sound.addEffect(pingPongDelay);
    //   sound.play()
    // });

    /**
     * level 3 test
     * */
    // var sound = new Pizzicato.Sound(AUDIO_DATA.listOfSoundFilesUrl["Niveau_-1_Accident.wav"], () => {
    //   sound.play()
    // });

    // var sound = new Pizzicato.Sound(AUDIO_DATA.listOfSoundFilesUrl["Niveau_-2_dettes.wav"], function () {
    //   var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
    //     feedback: 0.6,
    //     time: 0.4,
    //     mix: 0.5
    //   });
    //
    //   sound.addEffect(pingPongDelay);
    //   sound.volume = 0.25
    //   sound.play()
    // });

    // var sound2 = new Pizzicato.Sound(AUDIO_DATA.listOfSoundFilesUrl["Niveau_-3_ecrire.wav"], function () {
    //   // sound2.addEffect(dubDelay);
    //   // sound2.addEffect(delay);
    //
    //   console.log("====")
    //   console.log(sound2)
    //   console.log("====")
    //
    //   sound2.play()
    // });
  }

  loadAudioFiles() {

    return new Promise(resolve => {

      for (const soundFilesName in this.AUDIO_DATA.listOfSoundFilesUrl) {
        const soundFilesUrl = this.AUDIO_DATA.listOfSoundFilesUrl[soundFilesName]

        this._listOfSound[soundFilesName] = new Pizzicato.Sound(soundFilesUrl, () => {

          this._soundLoadedInfo.numberOfSoundLoaded++

          console.log("=====")
          console.log(this._soundLoadedInfo.numberOfSoundLoaded)
          console.log(this._soundLoadedInfo.numberOfSoundToLoad)
          console.log("=====")

          if(this._soundLoadedInfo.allIsLoaded()) resolve()

        }) as Sound

      }

    })

  }

  private _lastLevelOneSongPlayed?: Sound

  playLevel(level: LEVEL_NAMES, scoreOfEntierDiscution: number) {

    try {

      const mainSound = this.getRandomSoundInLevel(level).randomSoundInLevel

      let mainSoundVolume = .75

      // switch (level) {
      //   case LEVEL_NAMES.LEVEL_1:
      //     this._lastLevelOneSongPlayed = mainSound
      //     break
      //
      //   case LEVEL_NAMES.LEVEL_2:
      //
      //     if(! this._lastLevelOneSongPlayed) this._lastLevelOneSongPlayed =  this.getRandomSoundInLevel(LEVEL_NAMES.LEVEL_1).randomSoundInLevel
      //
      //     PizzicatoManager._removeEffectOfSound(this._lastLevelOneSongPlayed)
      //
      //     this._lastLevelOneSongPlayed.addEffect(this.effects.pingPongDelay)
      //
      //     this._lastLevelOneSongPlayed.volume = this.scale_to_0_1(scoreOfEntierDiscution, -1, -2, 0.15, .75)
      //
      //     mainSoundVolume = this.scale_to_0_1(scoreOfEntierDiscution, -1, -2, .3, 1)
      //
      //
      //     console.log(this._lastLevelOneSongPlayed.effects)
      //     this._lastLevelOneSongPlayed.play()
      //
      //     break
      //
      //   case LEVEL_NAMES.LEVEL_3:
      //
      //     if(! this._lastLevelOneSongPlayed) this._lastLevelOneSongPlayed =  this.getRandomSoundInLevel(LEVEL_NAMES.LEVEL_1).randomSoundInLevel
      //
      //     PizzicatoManager._removeEffectOfSound(this._lastLevelOneSongPlayed)
      //
      //     // debugger
      //
      //     this._lastLevelOneSongPlayed.addEffect(this.effects.pingPongDelayIntensity_2)
      //     // this._lastLevelOneSongPlayed.addEffect(this.effects.lowPassFilter)
      //
      //     console.log(JSON.stringify(this._lastLevelOneSongPlayed!.effects))
      //
      //     this._lastLevelOneSongPlayed.volume = 1
      //     console.log(this._lastLevelOneSongPlayed.effects)
      //     this._lastLevelOneSongPlayed.play()
      //
      //     break
      //   case LEVEL_NAMES.LEVEL_4:
      //
      //     break
      //   case LEVEL_NAMES.LEVEL_5:
      // }

      PizzicatoManager._removeEffectOfSound(mainSound)
      mainSound.volume = mainSoundVolume
      mainSound.play()

      console.log("=====")
      console.log(this._lastLevelOneSongPlayed ? this._lastLevelOneSongPlayed.volume : null)
      console.log(mainSound.volume)
      console.log("=====")

    } catch (e) {
      console.info("%ccan't read file", "background: pink", e)
    }
  }

  private static _removeEffectOfSound(sound: Sound) {
    for(const effect of sound.effects) {
      sound.removeEffect(effect)
    }
  }

  getRandomSoundInLevel(level: LEVEL_NAMES) {

    const arrayOfAudioNameOfLevel = this.AUDIO_DATA.listOfAudioFilesNameByLevel[level]
    const randomEntryInLevel      = getRandomInt(0, arrayOfAudioNameOfLevel.length)
    const randomAudioNameInLevel  = arrayOfAudioNameOfLevel[randomEntryInLevel]
    const randomSoundInLevel      = this._listOfSound[randomAudioNameInLevel]

    return {
      arrayOfAudioNameOfLevel,
      randomEntryInLevel,
      randomAudioNameInLevel,
      randomSoundInLevel,
    }
  }

  scale_to_0_1(num: number, in_min: number, in_max: number, out_min = 0, out_max = 1) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

}