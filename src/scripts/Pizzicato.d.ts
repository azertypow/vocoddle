declare module "Pizzicato" {

  export class Sound {
    constructor(src: string, onLoad: () => void)

    /**
     * when (number, defaults to 0): Time in seconds to wait before playing the sound.
     * offset (number, defaults to 0): Time in seconds where the sound will start.
     * */

    play(when?: number, offset?: number): void

    pause(): void

    stop(): void

    clone(): void

    addEffect (effect: any): void

    removeEffect(effect: any): void

    /**
     * min: 0, max: 1
     * */
    volume: number

    /**
     * min: 0, max: 10
     * */
    attack: number

    /**
     * min: 0, max: 10, default 0.04
     * */
    release: number

    /**
     * default 440
     * */
    frequency: number

    on(event: 'play' | 'pause' | 'stop' | 'end', f: () => void): void

    effects: any[]

  }

  const value: any
  export default value
}