import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';


interface _addMeshObjectLoadedToParentObjectParameters {
  parentObject: BABYLON.Mesh
  abstractMeshes: BABYLON.AbstractMesh[]
  material: BABYLON.StandardMaterial
}

interface IListOfObjectLoadedMeshes {
  caskWireframe: BABYLON.AbstractMesh[]
  cask: BABYLON.AbstractMesh[]
  headWireframe: BABYLON.AbstractMesh[]
  head: BABYLON.AbstractMesh[]
  [key: string]: BABYLON.AbstractMesh[]
}

type ListOfObjectLoadedMeshesMaps = keyof IListOfObjectLoadedMeshes

export class ObjectScene {

  private readonly ROOT_URL = "http://localhost:3000/static/"

  private readonly pinkColor        = new BABYLON.Color3(0.9882352941, 0.5921568627, 0.6980392157)  //rgb(252, 151, 178)
  private readonly extraWhiteColor  = new BABYLON.Color3(1, 1, 1)

  private readonly canvas = document.getElementById("renderCanvas") as HTMLCanvasElement

  // scene
  private readonly engine:  BABYLON.Engine
  private readonly scene:   BABYLON.Scene
  private readonly camera:  BABYLON.FreeCamera

  private readonly backgroundClearColor = new BABYLON.Color4(0, 0, 0, 0)

  // materials
  private readonly materialWireframe: BABYLON.StandardMaterial
  private readonly materialPink:      BABYLON.StandardMaterial
  private readonly materialWireframeHead:  BABYLON.StandardMaterial

  // objects
  private readonly objectParentsContainer:  BABYLON.Mesh
  private readonly objectParentCasque:      BABYLON.Mesh
  private readonly objectParentHead:        BABYLON.Mesh

  private readonly leftParentContainerPosition_x = -40
  private readonly leftParentContainerPosition_y = 0
  private readonly leftParentContainerPosition_z = 40

  private _listOfObjectLoadedMeshes: IListOfObjectLoadedMeshes = {
    caskWireframe:[],
    cask:[],
    headWireframe:[],
    head:[],
  }

  constructor() {
    // this.canvas.style.position = "fixed"
    // this.canvas.style.zIndex = "1000000"

    // scene
    this.engine = new BABYLON.Engine(this.canvas)
    this.scene  = new BABYLON.Scene(this.engine)
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene) // This creates and positions a free camera (non-mesh)

    // materials
    this.materialWireframeHead  = new BABYLON.StandardMaterial("mat0", this.scene)
    this.materialWireframe      = new BABYLON.StandardMaterial("mat0", this.scene)
    this.materialPink           = new BABYLON.StandardMaterial("mat1", this.scene)

    // objects
    this.objectParentsContainer = BABYLON.Mesh.CreateBox("objectParentCasque",  1, this.scene)
    this.objectParentCasque     = BABYLON.Mesh.CreateBox("objectParentCasque",  1, this.scene)
    this.objectParentHead       = BABYLON.Mesh.CreateBox("objectParentHead",    1, this.scene)

    this._setSceneParameters()
    this._setCameraParameters()
    this._setMaterialsParameters()
    this._setEngineParameters()
    this._setObjectParentParameters({
      initialScaling:   new BABYLON.Vector3(0.2, 0.2, 0.2),
      initialPosition:  new BABYLON.Vector3(
        0,
        this.leftParentContainerPosition_y,
        this.leftParentContainerPosition_z),
    })

    this._loadAndAddAllObjectsToScene().then(() => {

      this._setObjectLoadedMeshesVisibility("headWireframe",  false)
      this._setObjectLoadedMeshesVisibility("head",           false)

      this._listOfObjectLoadedMeshes.cask.forEach(value => {
        value.scaling = new BABYLON.Vector3(0.9999999, 0.9999999, 0.9999999)
      })

      this.canvas.style.opacity = "1"

      this._runAnimationRotation    ({animationDuration: 30 * 60 * 10})

      // this.startHeaderEntryAnimation()

      this.engine.runRenderLoop(() => {
        this.scene.render();
      })
    })

  }

  startMoveToLeftAnimation() {
    this._runAnimationGlobalPosition_toLeft({animationDuration: 30 * 60 * 0.04})
  }

  startHeaderEntryAnimation() {
    this._setObjectLoadedMeshesVisibility("headWireframe",  true)
    this._setObjectLoadedMeshesVisibility("head",           true)

    this._runAnimationGlobalPosition_toCenter({animationDuration: 30 * 60 * 0.04})

    this._runAnimationHeadPosition(           {animationDuration: 30 * 60 * 0.4})
    this._runAnimationHeadOpacity (           {animationDuration: 30 * 60 * 0.1})
  }

  startBlackBackgroundAnimation() {
    this._runMaterialPinkToBLack({ animationDuration: 30 / 1000 * 500, animationPropertyName: "ambientColor"})
    this._runMaterialPinkToBLack({ animationDuration: 30 / 1000 * 500, animationPropertyName: "diffuseColor"})
    this._runMaterialPinkToBLack({ animationDuration: 30 / 1000 * 500, animationPropertyName: "emissiveColor"})
    this._runMaterialPinkToBLack({ animationDuration: 30 / 1000 * 500, animationPropertyName: "specularColor"})

    this._runRotateToFace({animationDuration: 30 * 10})

    this.scene.stopAnimation(this.objectParentHead)
    this._runAnimationRestoreHeadPosition({animationDuration: 30 * 5})

    this._runAnimationHeadOpacityEnded({animationDuration: 30 * 60 * 0.4})
  }

  private _runAnimationRestoreHeadPosition ({animationDuration}: { animationDuration: number }) {

    const animation = new BABYLON.Animation("head", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: new BABYLON.Vector3(
        this.objectParentHead.position.x,
        this.objectParentHead.position.y,
        this.objectParentHead.position.z
      ),
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: new BABYLON.Vector3(0, 0, 0),
    });

    animation.setKeys(keys)

    this.objectParentHead.animations = []
    this.objectParentHead.animations.push(animation)

    this.scene.beginAnimation(this.objectParentHead, 0, animationDuration, false)
  }

  private _runAnimationHeadOpacityEnded  ({animationDuration}: { animationDuration: number }) {

    const animation = new BABYLON.Animation("head", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT)

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: .15,
    });

    keys.push({
      frame: animationDuration / 3,
      value: .15,
    });

    keys.push({
      frame: animationDuration / 5 * 4,
      value: .60,
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: .15,
    });

    animation.setKeys(keys)

    this.materialWireframeHead.animations = []
    this.materialWireframeHead.animations.push(animation)

    this.scene.beginAnimation(this.materialWireframeHead, 0, animationDuration, true)
  }

  private _runRotateToFace({animationDuration}: { animationDuration: number}) {

    const animation = new BABYLON.Animation("rotationToFace", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = []

    const currentRotationYInDegrees = this.objectParentsContainer.rotation.y * 180 / Math.PI

    keys.push({
      frame: 0,
      value: new BABYLON.Vector3(
        0,
        (currentRotationYInDegrees % 360) * (Math.PI / 180),
        0
      )
      ,
    });

    keys.push({
      frame: animationDuration,
      value: new BABYLON.Vector3(
        0,
        currentRotationYInDegrees < 180 ? 0 : 360 * (Math.PI / 180),
        0
      )
      ,
    });

    animation.setKeys(keys)

    this.objectParentsContainer.animations = []
    this.objectParentsContainer.animations.push(animation)

    this.scene.beginAnimation(this.objectParentsContainer, 0, animationDuration, false)
  }

  private _runMaterialPinkToBLack({animationDuration, animationPropertyName}: { animationDuration: number, animationPropertyName: "diffuseColor" | "specularColor" | "emissiveColor" | "ambientColor" }) {
    const animation = new BABYLON.Animation("pinkMateil" + animationPropertyName, animationPropertyName, 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3)

    // // Creating an easing function
    // var easingFunction = new BABYLON.CubicEase();
    //
    // // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
    // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    //
    // // Adding the easing function to the animation
    // animation.setEasingFunction(easingFunction);

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = []

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: this.pinkColor
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: new BABYLON.Color3(
        0,
        0,
        0,
      )
    });

    animation.setKeys(keys)

    this.materialPink.animations = []
    this.materialPink.animations.push(animation)

    this.scene.beginAnimation(this.materialPink, 0, animationDuration, false, undefined, undefined, undefined, false)
  }

  private _runAnimationRotation     ({animationDuration}: { animationDuration: number }) {

    const animation = new BABYLON.Animation("rotation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT)

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: 0,
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: 360,
    });

    animation.setKeys(keys)

    this.objectParentsContainer.animations = []
    this.objectParentsContainer.animations.push(animation)

    animation.addEvent(new BABYLON.AnimationEvent(60, () => {
      console.log("%cfirstAnimation ended", "background: black, color: white")
    }, true))

    this.scene.beginAnimation(this.objectParentsContainer, 0, animationDuration, true)
  }

  private _runAnimationGlobalPosition_toLeft({animationDuration}: { animationDuration: number }) {
    const animation = new BABYLON.Animation("headPostionToCenter", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)

    // Creating an easing function
    var easingFunction = new BABYLON.QuarticEase();

    // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    // Adding the easing function to the animation
    animation.setEasingFunction(easingFunction);

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = []

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: new BABYLON.Vector3(
        0,
        this.leftParentContainerPosition_y,
        this.leftParentContainerPosition_z
      )
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: new BABYLON.Vector3(
        this.leftParentContainerPosition_x,
        this.leftParentContainerPosition_y,
        this.leftParentContainerPosition_z
      )
    });

    animation.setKeys(keys)

    this.objectParentsContainer.animations = []
    this.objectParentsContainer.animations.push(animation)

    this.scene.beginAnimation(this.objectParentsContainer, 0, animationDuration, false, undefined, undefined, undefined, false)
  }

  private _runAnimationHeadPosition ({animationDuration}: { animationDuration: number }) {

    const animation = new BABYLON.Animation("head", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)

    // Creating an easing function
    var easingFunction = new BABYLON.CircleEase();

    // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    // Adding the easing function to the animation
    animation.setEasingFunction(easingFunction);

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, -100, 200),
    });

    keys.push({
      frame: animationDuration / 4,
      value: new BABYLON.Vector3(0, 0, 0),
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: new BABYLON.Vector3(0, 0, 0),
    });

    animation.setKeys(keys)

    animation.addEvent(new BABYLON.AnimationEvent(60, () => {
      console.log("%chead ended", "background: black, color: white")
    }, true))

    this.objectParentHead.animations = []
    this.objectParentHead.animations.push(animation)

    this.scene.beginAnimation(this.objectParentHead, 0, animationDuration, true)
  }

  private _runAnimationHeadOpacity  ({animationDuration}: { animationDuration: number }) {

    const animation = new BABYLON.Animation("head", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT)

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: 0,
    });

    keys.push({
      frame: animationDuration / 3,
      value: 0,
    });

    keys.push({
      frame: animationDuration / 5 * 4,
      value: 1,
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: 0,
    });

    animation.setKeys(keys)

    this.materialWireframeHead.animations = []
    this.materialWireframeHead.animations.push(animation)

    this.scene.beginAnimation(this.materialWireframeHead, 0, animationDuration, true)
  }

  private _runAnimationGlobalPosition_toCenter({animationDuration}: { animationDuration: number }) {
    const animation = new BABYLON.Animation("headPostionToCenter", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)

    // Creating an easing function
    var easingFunction = new BABYLON.CubicEase();

    // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    // Adding the easing function to the animation
    animation.setEasingFunction(easingFunction);

    // An array with all animation keys
    const keys: BABYLON.IAnimationKey[] = []

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: new BABYLON.Vector3(
        this.leftParentContainerPosition_x,
        this.leftParentContainerPosition_y,
        this.leftParentContainerPosition_z
      )
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: animationDuration,
      value: new BABYLON.Vector3(
        0,
        7,
        this.leftParentContainerPosition_z
      )
    });

    animation.setKeys(keys)

    this.objectParentsContainer.animations = []
    this.objectParentsContainer.animations.push(animation)

    this.scene.beginAnimation(this.objectParentsContainer, 0, animationDuration, false, undefined, undefined, undefined, false)
  }

  private _setObjectLoadedMeshesVisibility(objectLoadedMeshesKey: ListOfObjectLoadedMeshesMaps, visible: boolean) {
    this._listOfObjectLoadedMeshes[objectLoadedMeshesKey].forEach(value => {
      value.isVisible = visible
    })
  }

  private _setSceneParameters() {
    this.scene.shadowsEnabled = false
    this.scene.clearColor     = new BABYLON.Color4(0, 0, 0, 0)

    this.engine.setSize(this.canvas.width * 2, this.canvas.height * 2)
  }

  private _setCameraParameters() {
    // This targets the camera to scene origin
    this.camera.setTarget(new BABYLON.Vector3(0, 5, 0));
    this.camera.position = new BABYLON.Vector3(0, 0, -50)

    // camera.position.z = -100
    // camera.position.y = 50

    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true);
  }

  private _setMaterialsParameters() {
    // white line material
    this.materialWireframe.diffuseColor   = this.extraWhiteColor
    this.materialWireframe.diffuseColor   = this.extraWhiteColor
    this.materialWireframe.specularColor  = this.extraWhiteColor
    this.materialWireframe.emissiveColor  = this.extraWhiteColor
    this.materialWireframe.ambientColor   = this.extraWhiteColor

    this.materialWireframe.wireframe      = true

    // same color of background
    this.materialPink.diffuseColor        = this.pinkColor
    this.materialPink.diffuseColor        = this.pinkColor
    this.materialPink.specularColor       = this.pinkColor
    this.materialPink.emissiveColor       = this.pinkColor
    this.materialPink.ambientColor        = this.pinkColor

    this.materialPink.useReflectionFresnelFromSpecular  = false
    this.materialPink.reflectionTexture                 = null
    this.materialPink.useReflectionOverAlpha            = false
    this.materialPink.ambientTexture                    = null

    // head line material
    this.materialWireframeHead.diffuseColor   = this.extraWhiteColor
    this.materialWireframeHead.diffuseColor   = this.extraWhiteColor
    this.materialWireframeHead.specularColor  = this.extraWhiteColor
    this.materialWireframeHead.emissiveColor  = this.extraWhiteColor
    this.materialWireframeHead.ambientColor   = this.extraWhiteColor

    this.materialWireframeHead.wireframe      = true
  }

  private _setEngineParameters() {
    this.engine.loadingScreen = {
      displayLoadingUI: () => {},
      hideLoadingUI: () => {},
      loadingUIBackgroundColor: "",
      loadingUIText: "",
    }
  }

  private _setObjectParentParameters({initialScaling, initialPosition}: { initialScaling: BABYLON.Vector3, initialPosition: BABYLON.Vector3 }) {

    this.objectParentsContainer.isVisible   = false
    this.objectParentCasque.isVisible       = false
    this.objectParentHead.isVisible         = false

    this.objectParentsContainer.scaling     = initialScaling
    this.objectParentsContainer.position    = initialPosition

    this.objectParentCasque.parent          = this.objectParentsContainer
    this.objectParentHead.parent            = this.objectParentsContainer
  }

  private _objectLoader(fileName: string, objectName?: string): Promise<BABYLON.AbstractMesh[]> {
    return new Promise(resolve => {

      BABYLON.SceneLoader.LoadAssetContainer(this.ROOT_URL, fileName, this.scene, value => {
        resolve(value.meshes)
      })

    })
  }

  private async _multiObjectLoader(listOfObjectFileName: {[name: string]: string}) {

    const arrayOfObjectLoaded: {[key: string]: BABYLON.AbstractMesh[]} = {}

    for (const name in listOfObjectFileName) {
      const fileName = listOfObjectFileName[name]
      arrayOfObjectLoaded[name] = await this._objectLoader(fileName)
    }

    return  arrayOfObjectLoaded as IListOfObjectLoadedMeshes
  }

  private _addMeshObjectToParentObject({parentObject, abstractMeshes, material}: _addMeshObjectLoadedToParentObjectParameters) {

    for(const mesh of abstractMeshes) {

      this.scene.addMesh(mesh)

      mesh.parent = parentObject

      mesh.material = material

    }

  }

  private async _loadAndAddAllObjectsToScene() {

    this._listOfObjectLoadedMeshes = await this._multiObjectLoader({
      caskWireframe:  "elements3DResizing--casque.obj",
      cask:           "elements3DResizing--casque.obj",
      headWireframe:  "elements3DResizing--tete.obj",
      head:           "elements3DResizing--tete.obj",
    })

    this._addMeshObjectToParentObject({
      abstractMeshes: this._listOfObjectLoadedMeshes.caskWireframe,
      material:       this.materialWireframe,
      parentObject:   this.objectParentCasque,
    })

    this._addMeshObjectToParentObject({
      abstractMeshes: this._listOfObjectLoadedMeshes.cask,
      material:       this.materialPink,
      parentObject:   this.objectParentCasque,
    })

    this._addMeshObjectToParentObject({
      abstractMeshes: this._listOfObjectLoadedMeshes.headWireframe,
      material:       this.materialWireframeHead,
      parentObject:   this.objectParentHead,
    })

    this._addMeshObjectToParentObject({
      abstractMeshes: this._listOfObjectLoadedMeshes.head,
      material:       this.materialPink,
      parentObject:   this.objectParentHead,
    })
  }

}
