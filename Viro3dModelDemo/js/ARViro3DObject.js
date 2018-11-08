import React, { Component } from "react";
import {
  ViroARScene,
  ViroARCamera,
  ViroAmbientLight,
  Viro3DObject,
  ViroMaterials
} from "react-viro";

export default class ARViro3DObject extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" />
        <ViroARCamera>
          <Viro3DObject
            source={require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/Metal_Bottle_With_Sprayer_Cap_Generic.vrx")}
            scale={[0.02, 0.02, 0.02]}
            position={[0, -0.35, -0.5]}
            rotation={[-75, 0, 0]}
            type="VRX"
            materials="bottle"
          />
        </ViroARCamera>
      </ViroARScene>
    );
  }
}

ViroMaterials.createMaterials({
  bottle: {
    lightingModel: "Phong",
    diffuseTexture: require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/bottle_diffuse.png"),
    normalTexture: require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/bottle_reflection.png"),
    roughnessTexture: require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/plastic_bump.png")
  }
});
