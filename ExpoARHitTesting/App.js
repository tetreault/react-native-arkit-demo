import { AR } from 'expo';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';
import React from 'react';

import { View as GraphicsView } from 'expo-graphics';
import TouchableView from './TouchableView';

class HitTest extends React.Component {
  render() {
    // Setup a basic Graphics View and wrap it in a touchable view that simplifies PanResponder
    return (
      <TouchableView
        style={{ flex: 1 }}
        shouldCancelWhenOutside={false}
        onTouchesBegan={this.onTouchesBegan}>
        <GraphicsView
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          arTrackingConfiguration={AR.TrackingConfigurations.World}
          isArEnabled
          isArRunningStateEnabled
          isArCameraStateEnabled
        />
      </TouchableView>
    );
  }

  /*
    Standard AR setup
  */
  onContextCreate = ({ gl, scale, width, height }) => {
    // Get horizontal plane data
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // Basic Three Renderer with polyfill for expo-three
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      width,
      height,
      pixelRatio: scale,
    });

    this.scene = new THREE.Scene();
    // Add the camera stream to the background of the scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // Create an AR Camera that updates with the device position
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);
    // Add an equal lighting to the scene
    this.scene.add(new THREE.AmbientLight(0xdddddd));

    // Add a light to give depth to the scene
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  };

  onResize = ({ x, y, scale, width, height }) => {
    // When the phone resizes, we update the camera aspect ratio, and change the renderer
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    // Update the renderer with the scene and camera
    this.renderer.render(this.scene, this.camera);
  };
  /*
    End Standard AR setup
  */

  // Called when `onPanResponderGrant` is invoked.
  onTouchesBegan = async ({ locationX: x, locationY: y }) => {
   if (!this.renderer) {
      return;
    }

    // Get the size of the renderer
    const size = this.renderer.getSize();

    // Invoke the native hit test method
    const { hitTest } = await AR.performHitTest(
      {
        x: x / size.width,
        y: y / size.height,
      },
      // Result type from intersecting a horizontal plane estimate, determined for the current frame.
      AR.HitTestResultTypes.HorizontalPlane
    );

    // Traverse the test results
    for (let hit of hitTest) {
      const { worldTransform } = hit;
      // If we've already placed a cube, then remove it
      if (this.cube) {
        this.scene.remove(this.cube);
      }

      // Create a new cube 
      const geometry = new THREE.BoxGeometry(0.0254, 0.0254, 0.0254);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
      });
      this.cube = new THREE.Mesh(geometry, material);
      // Add the cube to the scene
      this.scene.add(this.cube);

      // Disable the matrix auto updating system
      this.cube.matrixAutoUpdate = false;

      /* 
      Parse the matrix array: ex: 
        [
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          0,0,0,1
        ]
      */
      const matrix = new THREE.Matrix4();
      matrix.fromArray(worldTransform);

      // Manually update the matrix 
      this.cube.applyMatrix(matrix);
      this.cube.updateMatrix();
    }
  };
}

export default HitTest;


/*
HitTestResultTypes = {
  
   * Result type from intersecting the nearest feature point.
  FeaturePoint: 'featurePoint',
  
   * Result type from intersecting a horizontal plane estimate, determined for the current frame.
  HorizontalPlane: 'horizontalPlane',
  
   * Result type from intersecting a vertical plane estimate, determined for the current frame.
  VerticalPlane: 'verticalPlane',
  
   * Result type from intersecting with an existing plane anchor.
  ExistingPlane: 'existingPlane',
  
   * Result type from intersecting with an existing plane anchor, taking into account the plane’s extent.
  ExistingPlaneUsingExtent: 'existingPlaneUsingExtent',
  
   * Result type from intersecting with an existing plane anchor, taking into account the plane’s geometry.
  ExistingPlaneUsingGeometry: 'existingPlaneUsingGeometry',
};
*/
