import React from "react";
import { StatusBar } from "react-native";
import Expo, { AR } from "expo";
import ExpoTHREE, { AR as ThreeAR, THREE } from "expo-three";
import { View as GraphicsView } from "expo-graphics";

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
        arTrackingConfiguration={AR.TrackingConfigurations.Orientation}
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

    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));

    // Particles
    const particleCount = 18;
    const particles = new THREE.Geometry();
    const pMaterial = new THREE.PointsMaterial({
      color: 0xff44ff,
      size: 12
    });

    // now create the individual particles
    for (let p = 0; p < particleCount; p++) {
      // create a particle with random
      // position values, -250 -> 250
      const pX = Math.random() * 500 - 250;
      const pY = Math.random() * 500 - 250;
      const pZ = Math.random() * 500 - 250;
      // expo says THREE.Vertex has been removed use Vector3 instead
      //const particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));
      const particle = new THREE.Vector3(pX, pY, pZ);

      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    const particleSystem = new THREE.ParticleSystem(particles, pMaterial);

    // add it to the scene
    this.scene.add(particleSystem);
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
