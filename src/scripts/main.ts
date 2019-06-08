import {getAudioFiles} from "./audioLoader"
import {run} from "./app"
import {ListenStatus} from "./ListenStatus"
import {Chorus, Distortion, Filter, PingPongDelay, Player, Players, Reverb, Vibrato, Volume} from "tone"

getAudioFiles().then((audioElementsByLevel) => {
  let listen = new ListenStatus(() => {
    console.log("change!!!")
  })

  document.addEventListener("mousedown", () => {
    listen.active = false
    console.log("down")
    document.body.classList.add("listen-off")
  })

  document.addEventListener("mouseup", () => {
    listen.active = true
    console.log("up")
    document.body.classList.remove("listen-off")
  })

  run(audioElementsByLevel, listen)
})

//
// const reverb = new Reverb(100000).toMaster()
//
// const player = new Player("https://tonejs.github.io/examples/audio/FWDL.mp3")
//   .connect(reverb)
//   .toMaster()
//
// document.addEventListener("click", () => {
//
//   console.log(player)
//
//   player.start()
// })

const chorus      = new Chorus(4, 2.5, 0.5).toMaster()
const reverb      = new Reverb().toMaster()
const hipass      = new Filter(2000, 'highpass', -48).toMaster()
const vibrato     = new Vibrato(50, 1).toMaster()
const distortion  = new Distortion(2).toMaster()

const pingpong = new PingPongDelay(1, 0.9).toMaster() // --> niveau 4 + voix en cours

reverb.decay = 50
reverb.preDelay = 0.1
reverb.generate().then(() => {

  const soundFiles = {
    sound1: 'http://localhost:3000/static/audio/Niveau_-3/pupille.wav',
    sound2: 'https://tonejs.github.io/examples/audio/FWDL.mp3',
    sound3: 'http://localhost:3000/static/audio/Niveau_-1/Accident.wav',
  }

  const sounds =
    new Players(soundFiles)
      // .connect(chorus)
      // .connect(reverb)
      .connect(pingpong)
      // .connect(hipass)
      // .connect(vibrato)
      // .connect(distortion)
      .toMaster()


  document.addEventListener("click", () => {

    console.log(sounds)

    // console.log(player)

    const test = sounds.get('sound3')

    if(test) {
      test.volume.value = -10

      test.start()
    }
  })
})
