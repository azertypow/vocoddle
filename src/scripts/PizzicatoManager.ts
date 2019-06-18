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

          if(this._soundLoadedInfo.allIsLoaded()) resolve(this._listOfSound)

        }) as Sound

      }

    })

  }

  private _lastSoundLevel_1_withEffect: Sound | undefined = this.getRandomSoundDataInLevel(LEVEL_NAMES.LEVEL_1).randomSoundInLevel_withEffect
  private _lastSoundLevel_2_withEffect: Sound | undefined = this.getRandomSoundDataInLevel(LEVEL_NAMES.LEVEL_2).randomSoundInLevel_withEffect
  private _lastSoundLevel_3_withEffect: Sound | undefined = this.getRandomSoundDataInLevel(LEVEL_NAMES.LEVEL_3).randomSoundInLevel_withEffect
  private _lastSoundLevel_4_withEffect: Sound | undefined = this.getRandomSoundDataInLevel(LEVEL_NAMES.LEVEL_4).randomSoundInLevel_withEffect

  private lastSoundPlaying: {
    main:           Sound | null,
    levelEffect_1:  Sound | null,
    levelEffect_2:  Sound | null,
    levelEffect_3:  Sound | null,
    levelEffect_4:  Sound | null,
  } = {
    main: null,
    levelEffect_1: null,
    levelEffect_2: null,
    levelEffect_3: null,
    levelEffect_4: null,
  }

  private positive = this.getRandomSoundDataInLevel(LEVEL_NAMES.LEVEL_0).randomSoundInLevel

  playLevel(level: LEVEL_NAMES, scoreOfEntierDiscution: number) {

    try {

      const mainSoundData     = this.getRandomSoundDataInLevel(level)

      const mainSoundVolume = .75

      switch (level) {
        case LEVEL_NAMES.LEVEL_1:

          // save effect
          this._lastSoundLevel_1_withEffect = mainSoundData.randomSoundInLevel_withEffect

          // set volume
          mainSoundData.randomSoundInLevel.volume = mainSoundVolume

          // play
          if( this.lastSoundPlaying.main === null ||
            ! this.lastSoundPlaying.main.playing) {
              this.lastSoundPlaying.main =  mainSoundData.randomSoundInLevel
                                            mainSoundData.randomSoundInLevel.play()
          }

          // debugger

          break

        case LEVEL_NAMES.LEVEL_2:

          // save effect
          this._lastSoundLevel_2_withEffect = mainSoundData.randomSoundInLevel_withEffect

          // set volume
          mainSoundData.randomSoundInLevel.volume = scale_to({
            num: scoreOfEntierDiscution,
            in_min: -1,
            in_max: -2,
            out_min: .3,
            out_max: 1
          })

          if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.volume = scale_to({
            num: scoreOfEntierDiscution,
            in_min:   -1,
            in_max:   -2,
            out_min:  0.3,
            out_max:  1
          })

          // play
          if( this.lastSoundPlaying.main === null ||
            ! this.lastSoundPlaying.main.playing) {
              this.lastSoundPlaying.main =  mainSoundData.randomSoundInLevel
                                            mainSoundData.randomSoundInLevel.play()
          }

          if( this.lastSoundPlaying.levelEffect_1 === null ||
            ! this.lastSoundPlaying.levelEffect_1.playing) {
              this.lastSoundPlaying.levelEffect_1 = this._lastSoundLevel_1_withEffect ? this._lastSoundLevel_1_withEffect : null
              if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.play()
          }

          // debugger

          break

        case LEVEL_NAMES.LEVEL_3:

          // save effect
          this._lastSoundLevel_3_withEffect = mainSoundData.randomSoundInLevel_withEffect

          // set volume
          mainSoundData.randomSoundInLevel.volume = scale_to({
            num: scoreOfEntierDiscution,
            in_min: -1,
            in_max: -2,
            out_min: .3,
            out_max: 1
          })

          const effectVolumValue = scale_to({
            num: scoreOfEntierDiscution,
            in_min:   -1,
            in_max:   -2,
            out_min:  0.15,
            out_max:  mainSoundVolume
          })

          if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.volume = effectVolumValue
          else console.info("can't load sound _lastSoundLevel_1_withEffect")
          if(this._lastSoundLevel_2_withEffect) this._lastSoundLevel_2_withEffect.volume = effectVolumValue
          else console.info("can't load sound _lastSoundLevel_2_withEffect")

          if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.addEffect(new Pizzicato.Effects.StereoPanner({
            pan: -.75,
          }))

          if(this._lastSoundLevel_2_withEffect) this._lastSoundLevel_2_withEffect.addEffect(new Pizzicato.Effects.StereoPanner({
            pan: .75,
          }))

          // play
          if( this.lastSoundPlaying.main === null ||
            ! this.lastSoundPlaying.main.playing) {
              this.lastSoundPlaying.main =  mainSoundData.randomSoundInLevel
                                            mainSoundData.randomSoundInLevel.play()
          }

          if( this.lastSoundPlaying.levelEffect_1 === null ||
            ! this.lastSoundPlaying.levelEffect_1.playing) {
              this.lastSoundPlaying.levelEffect_1 = this._lastSoundLevel_1_withEffect ? this._lastSoundLevel_1_withEffect : null
              if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.play()
          }

          if( this.lastSoundPlaying.levelEffect_2 === null ||
            ! this.lastSoundPlaying.levelEffect_2.playing) {
              this.lastSoundPlaying.levelEffect_2 = this._lastSoundLevel_2_withEffect ? this._lastSoundLevel_2_withEffect : null
              if(this._lastSoundLevel_2_withEffect) this._lastSoundLevel_2_withEffect.play()
          }

          // debugger

          break

        case LEVEL_NAMES.LEVEL_4:

          // save effect
          this._lastSoundLevel_4_withEffect = mainSoundData.randomSoundInLevel_withEffect

          // set volume
          mainSoundData.randomSoundInLevel.volume = scale_to({
            num: scoreOfEntierDiscution,
            in_min: -1,
            in_max: -2,
            out_min: .3,
            out_max: 1
          })

          if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.volume = 1
          else console.info("can't load sound _lastSoundLevel_1_withEffect")
          if(this._lastSoundLevel_2_withEffect) this._lastSoundLevel_2_withEffect.volume = 1
          else console.info("can't load sound _lastSoundLevel_2_withEffect")

          if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.addEffect(new Pizzicato.Effects.StereoPanner({
            pan: -.75,
          }))

          if(this._lastSoundLevel_2_withEffect) this._lastSoundLevel_2_withEffect.addEffect(new Pizzicato.Effects.StereoPanner({
            pan: .75,
          }))

          const effectVolumValue2 = scale_to({
            num: scoreOfEntierDiscution,
            in_min:   -1,
            in_max:   -2,
            out_min:  0.15,
            out_max:  mainSoundVolume
          })

          if(this._lastSoundLevel_3_withEffect) this._lastSoundLevel_3_withEffect.volume = effectVolumValue2
          else console.info("can't load sound _lastSoundLevel_3_withEffect")

          // play
          if( this.lastSoundPlaying.main === null ||
            ! this.lastSoundPlaying.main.playing) {
              this.lastSoundPlaying.main =  mainSoundData.randomSoundInLevel
                                            mainSoundData.randomSoundInLevel.play()
          }

          if( this.lastSoundPlaying.levelEffect_1 === null ||
            ! this.lastSoundPlaying.levelEffect_1.playing) {
              this.lastSoundPlaying.levelEffect_1 = this._lastSoundLevel_1_withEffect ? this._lastSoundLevel_1_withEffect : null
              if(this._lastSoundLevel_1_withEffect) this._lastSoundLevel_1_withEffect.play()
          }

          if( this.lastSoundPlaying.levelEffect_2 === null ||
            ! this.lastSoundPlaying.levelEffect_2.playing) {
              this.lastSoundPlaying.levelEffect_2 = this._lastSoundLevel_2_withEffect ? this._lastSoundLevel_2_withEffect : null
              if(this._lastSoundLevel_2_withEffect) this._lastSoundLevel_2_withEffect.play()
          }



          if( this.lastSoundPlaying.levelEffect_3 === null ||
            ! this.lastSoundPlaying.levelEffect_3.playing) {
              this.lastSoundPlaying.levelEffect_3 = this._lastSoundLevel_3_withEffect ? this._lastSoundLevel_3_withEffect : null
              if(this._lastSoundLevel_3_withEffect) this._lastSoundLevel_3_withEffect.play()
          }

          break

        // case LEVEL_NAMES.LEVEL_5:

        default :
          // set volume
          this.positive.volume = 1

          // play
          this.positive.play()
      }

      console.log("=====")
      // console.log(mainSoundData.volume)
      console.log("=====")

    } catch (e) {
      // debugger
      console.info("%ccan't read file", "background: pink", e)
    }
  }

  getRandomSoundDataInLevel(level: LEVEL_NAMES) {

    const arrayOfAudioNameOfLevel       = this.AUDIO_DATA.listOfAudioFilesNameByLevel[level]
    const randomEntryInLevel            = getRandomInt(0, arrayOfAudioNameOfLevel.length)
    const randomAudioNameInLevel        = arrayOfAudioNameOfLevel[randomEntryInLevel]
    const randomSoundInLevel            = this._listOfSound[randomAudioNameInLevel]
    const randomSoundInLevel_withEffect = this._listOfSound["FX" + randomAudioNameInLevel]

    console.log("randomAudioNameInLevel :" + randomAudioNameInLevel)
    console.log("randomSoundInLevel_withEffect :" + "FX" + randomAudioNameInLevel)
    console.log(this._listOfSound)

    return {
      arrayOfAudioNameOfLevel,
      randomEntryInLevel,
      randomAudioNameInLevel,
      randomSoundInLevel,
      randomSoundInLevel_withEffect,
    }
  }
}

function scale_to({num, in_min, in_max, out_min = 0, out_max = 1}: { num: number, in_min: number, in_max: number, out_min?: number, out_max?: number }) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
