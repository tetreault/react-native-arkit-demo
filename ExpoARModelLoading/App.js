import React from "react";
import { StatusBar } from "react-native";
import Expo, { AR } from "expo";
import ExpoTHREE, { AR as ThreeAR, THREE } from "expo-three";
import { View as GraphicsView } from "expo-graphics";
import Assets from "./Assets";

export default class App extends React.Component {
  render() {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
        arTrackingConfiguration={AR.TrackingConfigurations.World}
      />
    );
  }

  componentDidMount() {
    THREE.suppressExpoWarnings(true);
    StatusBar.setBarStyle("dark-content", true);
  }

  componentWillUnmount() {
    THREE.suppressExpoWarnings(false);
    AR.stopAsync();
  }

  loading_method_3 = async () => {
    const model = Assets.models.collada.stormtrooper;
    const onProgress = () => {
      console.log("progress console log");
    };
    const onAssetRequested = assetName => model[assetName];
    const collada = await ExpoTHREE.loadDaeAsync({
      asset: model["stormtrooper.dae"],
      onProgress,
      onAssetRequested
    });
    return collada;
  };

  // When our context is built we can start coding 3D things.
  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene();
    // This will create a camera texture and use it as the background for our scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // Now we make a camera that matches the device orientation.
    // Ex: When we look down this camera will rotate to look down too!
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    // load in and render a DAE file
    const model = Assets.models.collada.stormtrooper;
    const onProgress = () => {
      console.log("progress console log");
    };
    const onAssetRequested = assetName => model[assetName];
    const { scene: mesh } = await ExpoTHREE.loadDaeAsync({
      asset: model["stormtrooper.dae"],
      onProgress,
      onAssetRequested
    });
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 0.25);
    ExpoTHREE.utils.alignMesh(mesh, { y: 0, x: 0, z: 0 });
    mesh.position.z = 1;
    this.scene.add(mesh);

    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));
  };

  // When the phone rotates, or the view changes size, this method will be called.
  onResize = ({ x, y, scale, width, height }) => {
    // Let's stop the function if we haven't setup our scene yet
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  // Called every frame.
  onRender = () => {
    // Finally render the scene with the AR Camera
    this.renderer.render(this.scene, this.camera);
  };
}
