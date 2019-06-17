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

export enum LEVEL_NAMES {
  LEVEL_0   = "Niveau_0",
  LEVEL_1   = "Niveau_-1",
  FXLEVEL_1 = "FXNiveau_-1",
  LEVEL_2   = "Niveau_-2",
  FXLEVEL_2 = "FXNiveau_-2",
  LEVEL_3   = "Niveau_-3",
  FXLEVEL_3 = "FXNiveau_-3",
  LEVEL_4   = "Niveau_-4",
  FXLEVEL_4 = "FXNiveau_-4",
  LEVEL_5   = "Niveau_-5",
}

export type ListOfAudioFiles = {
  [key in LEVEL_NAMES]: {[key: string]: string}
}

export function generateAudioData(listOfAudioFiles: ListOfAudioFiles): IAudioData {

  const listOfAudioFilesNameByLevel: ListOfAudioFilesNameByLevel = {
    "Niveau_0"    : [],
    "Niveau_-1"   : [],
    "FXNiveau_-1" : [],
    "Niveau_-2"   : [],
    "FXNiveau_-2" : [],
    "Niveau_-3"   : [],
    "FXNiveau_-3" : [],
    "Niveau_-4"   : [],
    "FXNiveau_-4" : [],
    "Niveau_-5"   : [],
  }

  const listOfSoundFilesUrl: ListOfSoundFilesUrl = {}

  for(const key in listOfAudioFiles) {

    const audioFilesLevelName = key as LEVEL_NAMES

    listOfAudioFilesNameByLevel[audioFilesLevelName] = []

    const listOfAudioFilesInLevel = listOfAudioFiles[audioFilesLevelName]

    for(const audioFileName in listOfAudioFilesInLevel) {

      const audioFileNameWithoutExtension = audioFileName.replace(/\.[^\.]{1,3}$/gm, "")

      const audioFileGeneratedName = `${audioFilesLevelName}_${audioFileNameWithoutExtension}`

      const audioFilePath = "http://localhost:3000/static/" + listOfAudioFilesInLevel[audioFileName]

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
  [levelName in LEVEL_NAMES]: string[]
}

export type ListOfSoundFilesUrl = {
  [name: string]: string
}
