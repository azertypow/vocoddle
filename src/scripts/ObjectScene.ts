import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';


export function createObjectScene() {

  const NUMBER_OF_ELEMENTS_TO_LOAD = 2
  let elementLoadedCounter = 0

  const pinkColor = new BABYLON.Color3(1, 0.81568627451, 0.8)

  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
  // canvas.style.position = "fixed"
  // canvas.style.zIndex = "1000000"

  const engine = new BABYLON.Engine(canvas)

  const scene = new BABYLON.Scene(engine);

  scene.shadowsEnabled = false

  scene.clearColor = new BABYLON.Color4(1, 0, 0, 0);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
  camera.setTarget(new BABYLON.Vector3(0, 5, 0));
  camera.position = new BABYLON.Vector3(0, 0, -50)

  // camera.position.z = -100
  // camera.position.y = 50

// This attaches the camera to the canvas
  camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//   const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
//
// // Default intensity is 1. Let's dim the light a small amount
//   light.intensity = 0.7;

// Create material
  const materialWireframe = new BABYLON.StandardMaterial("mat0", scene);
  materialWireframe.diffuseColor = new BABYLON.Color3(1, 1, 1);
  materialWireframe.wireframe = true

  materialWireframe.diffuseColor    = new BABYLON.Color3(1, 1, 1)
  materialWireframe.specularColor   = new BABYLON.Color3(1, 1, 1)
  materialWireframe.emissiveColor   = new BABYLON.Color3(1, 1, 1)
  materialWireframe.ambientColor    = new BABYLON.Color3(1, 1, 1)

  const pinkMaterial = new BABYLON.StandardMaterial("mat1", scene)
  pinkMaterial.diffuseColor = pinkColor
  pinkMaterial.useReflectionFresnelFromSpecular = false
  pinkMaterial.reflectionTexture = null
  pinkMaterial.useReflectionOverAlpha = false
  pinkMaterial.ambientTexture = null

  pinkMaterial.diffuseColor   = pinkColor
  pinkMaterial.specularColor  = pinkColor
  pinkMaterial.emissiveColor  = pinkColor
  pinkMaterial.ambientColor   = pinkColor

  engine.loadingScreen = {
    displayLoadingUI: () => {},
    hideLoadingUI: () => {},
    loadingUIBackgroundColor: "",
    loadingUIText: "",
  }

  const objectParentCasque = BABYLON.Mesh.CreateBox("objectRay", 1, scene)

  objectParentCasque.isVisible = false

  objectParentCasque.rotation.x = 0
  objectParentCasque.rotation.y = 0
  objectParentCasque.rotation.z = 0

  objectParentCasque.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2)

  objectParentCasque.position = new BABYLON.Vector3(0, 0, 0)

  BABYLON.SceneLoader.LoadAssetContainer("http://localhost:3000/static/", "elements3DResizing--casque.obj", scene, value => {

    elementLoadedCounter++

    scene.addMesh(value.meshes[0])
    scene.addMesh(value.meshes[1])

    value.meshes[0].parent = objectParentCasque
    value.meshes[1].parent = objectParentCasque

    value.meshes[0].material = materialWireframe
    value.meshes[1].material = materialWireframe

    objectParentCasque.position.x = 0
    objectParentCasque.position.y = 0
    objectParentCasque.position.z = 40

    if(elementLoadedCounter === NUMBER_OF_ELEMENTS_TO_LOAD) canvas.style.opacity = "1"
  });

  BABYLON.SceneLoader.LoadAssetContainer("http://localhost:3000/static/", "elements3DResizing--casque.obj", scene, value => {

    elementLoadedCounter++

    scene.addMesh(value.meshes[0])
    scene.addMesh(value.meshes[1])

    value.meshes[0].parent = objectParentCasque
    value.meshes[1].parent = objectParentCasque

    value.meshes[0].material = pinkMaterial
    value.meshes[1].material = pinkMaterial

    if(elementLoadedCounter === NUMBER_OF_ELEMENTS_TO_LOAD) canvas.style.opacity = "1"
  })

  // Render every frame
  engine.runRenderLoop(() => {

    objectParentCasque.rotation.y += .01

    scene.render();
  });

}
