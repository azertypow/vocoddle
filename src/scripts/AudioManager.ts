import {
  AutoFilter,
  Channel,
  Chorus,
  CtrlRandom,
  Distortion,
  Filter,
  PingPongDelay,
  Players, Pow,
  Reverb,
  Tremolo,
  Vibrato
} from "tone"
import {IAudioData, LEVEL_NAMES} from "./audioLoader"

export class AudioManager {

  private readonly PING_PONG_FEEDBACK_DURATION = 0.9

  private _filters: IAudioManagerFilters = {
    chorus      : new Chorus(1, 100, 100).toMaster(),
    reverb      : new Reverb().toMaster(),
    hipass      : new Filter(2000, 'highpass', -48).toMaster(),
    vibrato     : new Vibrato(100, 0.0).toMaster(),
    distortion  : new Distortion(1).toMaster(),
    pingPong    : new PingPongDelay("4n", 0.5).toMaster(), // --> niveau 4 + voix en cours
    tremolo     : new AutoFilter(5, 20, 3.5),
  }

  private output: IAudioManagerOutput = {
    main: {
      channel: new Channel().toMaster(),
      // currentFilter: [],
    },
    withPingPongEffect: {
      channel: new Channel().toMaster(),
      // currentFilter: [],
    },
    level3Effect: {
      channel: new Channel().toMaster(),
    }
  }

  constructor(private readonly _audioData: IAudioData) {

    this._filters.reverb.decay = 10
    this._filters.reverb.preDelay = .1

    this._filters.reverb.generate().then(() => {

      this._intiPlayersOfOutput("main")
      this._intiPlayersOfOutput("withPingPongEffect")
      this._intiPlayersOfOutput("level3Effect")

      document.addEventListener("click", (ev) => {

        if(! ev.altKey) {

          /**
           * level 1
           */

          // this.playSound("main", LEVEL_NAMES.LEVEL_1)

          /**
           * level 2
           */

          // this._filters.pingPong = new PingPongDelay("4n", 0.5).toMaster()
          //
          // this.addEffectToChannel("withPingPongEffect", "pingPong")
          //
          // this.getChanel("withPingPongEffect").volume.value = -10
          //
          // this.playSound("main", LEVEL_NAMES.LEVEL_2)
          // this.playSound("withPingPongEffect", LEVEL_NAMES.LEVEL_1)


          /**
           * level 3
           * */

          // this._filters.pingPong = new PingPongDelay("4n", 0.5).toMaster()
          //
          // this.addEffectToChannel("withPingPongEffect", "pingPong")
          // this.getChanel("withPingPongEffect").volume.value = -20
          //
          // // this.addEffectToChannel("level3Effect", "reverb")
          // // this.addEffectToChannel("level3Effect", "vibrato")
          //
          // const powTest = new Pow(100)
          //
          // this.getChanel("level3Effect").connect(powTest)
          //
          // // this.playSound("main", LEVEL_NAMES.LEVEL_3)
          // this.playSound("level3Effect", LEVEL_NAMES.LEVEL_2)
          // // this.playSound("withPingPongEffect", LEVEL_NAMES.LEVEL_1)
        }

        console.log("=====")
        console.log("=====")
        console.log(this.output["main"].durationOfLastStartedPlayer)
        console.log(this.output["withPingPongEffect"].durationOfLastStartedPlayer)
        console.log(new Date().getTime() / 1000 - this.output["withPingPongEffect"].dateWhenLastPlayerWasStarted!)

        console.log("=====")

      })
    })

  }

  getChanel(output: AudioManagerOutputMap) { return this.output[output].channel }

  playSound(output: AudioManagerOutputMap, level: LEVEL_NAMES) {

    const players = this.output[output].players

    if(players) {

      const arrayOfAudioFilesInLevel = this._audioData.listOfAudioFilesNameByLevel[level]

      const ctrlRandomInArrayOfAudioFilesInLevel = new CtrlRandom(0, arrayOfAudioFilesInLevel.length)
      ctrlRandomInArrayOfAudioFilesInLevel.integer = true

      const nameOfFileToPlay: string = arrayOfAudioFilesInLevel[ctrlRandomInArrayOfAudioFilesInLevel.value as number]

      const sound = players.get(nameOfFileToPlay)

      if(sound) {

        sound.start()

        if(output === "withPingPongEffect") this.output[output].durationOfLastStartedPlayer = sound.buffer.duration + (this.PING_PONG_FEEDBACK_DURATION * 4* 5)
        else                                this.output[output].durationOfLastStartedPlayer = sound.buffer.duration

        this.output[output].dateWhenLastPlayerWasStarted  = new Date().getTime() / 1000
      }

      return sound
    }
  }

  removeEffectFromChannel(output: AudioManagerOutputMap, filter: AudioManagerFiltersMap) {

    try {

      this.output[output].channel.disconnect(this._filters[filter])

    } catch (e) {

      console.info(`%c no filter ${filter} on channel ${output}`, "color: pink")

    }
  }

  addEffectToChannel(output: AudioManagerOutputMap, filter: AudioManagerFiltersMap) {
    this.output[output].channel.connect(this._filters[filter])
  }

  private _intiPlayersOfOutput(output: AudioManagerOutputMap) {
    this.output[output].players   = new Players(this._audioData.listOfSoundFilesUrl)
    this.output[output].players!.chain(this.output[output].channel)
  }
}

export interface IAudioManagerFilters {
  pingPong:   PingPongDelay;
  hipass:     Filter;
  chorus:     Chorus;
  reverb:     Reverb;
  vibrato:    Vibrato;
  distortion: Distortion;
  tremolo   : AutoFilter,
}

export type AudioManagerFiltersMap = keyof IAudioManagerFilters

export interface IAudioManagerOutput {
  main:   {
    players?: Players,
    channel: Channel,
    // currentFilter: AudioManagerFiltersMap[],
    durationOfLastStartedPlayer?: number,
    durationOfLastStartedPlayer_withEffect?: number,
    dateWhenLastPlayerWasStarted?: number
  },
  withPingPongEffect: {
    players?: Players,
    channel: Channel,
    // currentFilter: AudioManagerFiltersMap[],
    durationOfLastStartedPlayer?: number,
    durationOfLastStartedPlayer_withEffect?: number,
    dateWhenLastPlayerWasStarted?: number
  },
  level3Effect: {
    players?: Players,
    channel: Channel,
    // currentFilter: AudioManagerFiltersMap[],
    durationOfLastStartedPlayer?: number,
    durationOfLastStartedPlayer_withEffect?: number,
    dateWhenLastPlayerWasStarted?: number
  },
}

export type AudioManagerOutputMap = keyof IAudioManagerOutput
