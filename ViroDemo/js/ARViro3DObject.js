import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroConstants,
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
        <Viro3DObject
          source={require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/Metal_Bottle_With_Sprayer_Cap_Generic.vrx")}
          scale={[0.03, 0.03, 0.03]}
          position={[0, 0, -2]}
          type="VRX"
          materials="bottle"
        />
      </ViroARScene>
    );
  }
}

ViroMaterials.createMaterials({
  bottle: {
    lightingModel: "Lambert",
    diffuseTexture: require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/bottle_diffuse.png"),
    normalTexture: require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/bottle_reflection.png"),
    roughnessTexture: require("./res/Metal_Bottle_With_Sprayer_Cap_Generic_fbx/plastic_bump.png")
  }
});

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center"
  }
});
