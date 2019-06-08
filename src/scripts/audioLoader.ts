export async function getListOfAudioFiles(): Promise<ListOfAudioFiles> {
  const myHeaders = new Headers();

  const myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' };

  const listOfAudioRequest = new Request('http://localhost:3000/',myInit as any);

  const audioRequestResponse = await fetch(listOfAudioRequest,myInit as any)

  return await audioRequestResponse.json() as ListOfAudioFiles
}

export interface IAudioElements {
  "Niveau_-1": HTMLAudioElement[]
  "Niveau_-2": HTMLAudioElement[]
  "Niveau_-3": HTMLAudioElement[]
  "Niveau_-4": HTMLAudioElement[]
  "Niveau_-5": HTMLAudioElement[]
}

export type EntriesName = keyof IAudioElements

export enum LEVEL_NAMES {
  LEVEL_1 = "Niveau_-1",
  LEVEL_2 = "Niveau_-2",
  LEVEL_3 = "Niveau_-3",
  LEVEL_4 = "Niveau_-4",
  LEVEL_5 = "Niveau_-5",
}
export type LevelName = keyof typeof LEVEL_NAMES

export type ListOfAudioFiles = {
  [key in LevelName]: {[key: string]: string}
}

export function generateAudioData(listOfAudioFiles: ListOfAudioFiles): IAudioData {

  const listOfAudioFilesNameByLevel: ListOfAudioFilesNameByLevel = {
    LEVEL_1: [],
    LEVEL_2: [],
    LEVEL_3: [],
    LEVEL_4: [],
    LEVEL_5: [],
  }

  const listOfSoundFilesUrl: ListOfSoundFilesUrl = {}

  for(const key in listOfAudioFiles) {

    const audioFilesLevelName = key as LevelName

    listOfAudioFilesNameByLevel[audioFilesLevelName] = []

    const listOfAudioFilesInLevel = listOfAudioFiles[audioFilesLevelName]

    for(const audioFileName in listOfAudioFilesInLevel) {

      const audioFileGeneratedName = `${audioFilesLevelName}_${audioFileName}`

      const audioFilePath = listOfAudioFilesInLevel[audioFileName]

      listOfAudioFilesNameByLevel[audioFilesLevelName].push(audioFileGeneratedName)

      listOfSoundFilesUrl[audioFileGeneratedName] = audioFilePath
    }
  }

  return {
    listOfAudioFilesNameByLevel,
    listOfSoundFilesUrl,
  }
}

export interface IAudioData {
  listOfAudioFilesNameByLevel: ListOfAudioFilesNameByLevel,
  listOfSoundFilesUrl: ListOfSoundFilesUrl,
}

export type ListOfAudioFilesNameByLevel = {
  [levelName in LevelName]: string[]
}

export type ListOfSoundFilesUrl = {
  [name: string]: string
}
