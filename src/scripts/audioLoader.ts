export async function getAudioFiles() {
  const audioFiles = await getAudioFilesList()

  return await createAudioElements(audioFiles)
}

function createAudioElements(audioData: IAudio): Promise<{[key: string]: HTMLAudioElement[]}> {

  return new Promise(resolve => {
    const audioContainer = document.createElement("div")

    const audioFilesObject = {} as {
      [key: string]: HTMLAudioElement[]
    }

    let audioCreated  = 0
    let audioLoaded   = 0

    for(const levelName in audioData) {
      const audioFiles = audioData[levelName]

      audioFilesObject[levelName] = []

      for(const audioName in audioFiles) {
        if(audioFiles.hasOwnProperty(audioName)) {
          const audioElement = document.createElement("audio")
          audioElement.preload = "auto"
          audioElement.src = `http://localhost:3000/static/${audioFiles[audioName]}`

          audioCreated++

          audioElement.addEventListener("canplay", () => {
            audioLoaded++
            console.log(audioCreated)
            console.log(audioLoaded)

            if(audioCreated === audioLoaded) resolve(audioFilesObject)
          })

          audioFilesObject[levelName].push(audioElement)
          audioContainer.appendChild(audioElement)
        }
      }
    }

    document.body.appendChild(audioContainer)

    document.addEventListener("click", () => {audioFilesObject["Niveau_1"][0].play()})
  })

}

async function getAudioFilesList() {
  const myHeaders = new Headers();

  const myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' };

  const listOfAudioRequest = new Request('http://localhost:3000/',myInit as any);

  const audioRequestResponse = await fetch(listOfAudioRequest,myInit as any)

  return await audioRequestResponse.json() as IAudio
}

export interface IAudio {
  [key: string]: {[key: string]: string}
  "Niveau 1": {[key: string]: string}
  "Niveau 2": {[key: string]: string}
  "Niveau 3": {[key: string]: string}
  "Niveau 4": {[key: string]: string}
  "Niveau 5": {[key: string]: string}
}
