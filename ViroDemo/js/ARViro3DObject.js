import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { ViroARScene, ViroText, ViroConstants, Viro3DObject } from "react-viro";

export default class ARViro3DObject extends Component {
  constructor() {
    super();

    this.state = {
      text: "Initializing AR..."
    };

    this._onInitialized = this._onInitialized.bind(this);
  }

  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized}>
        <Viro3DObject
          source={require("/js/res/Metal_Bottle_With_Sprayer_Cap_Generic/Metal_Bottle_With_Sprayer_Cap_Generic.fbx")}
          resources={[
            require("/js/res/Metal_Bottle_With_Sprayer_Cap_Generic/bottle_diffuse.png"),
            require("/js/res/Metal_Bottle_With_Sprayer_Cap_Generic/bottle_reflection.png"),
            require("/js/res/Metal_Bottle_With_Sprayer_Cap_Generic/plastic_bump.png")
          ]}
          position={[0.0, 0.0, -10]}
          scale={[0.1, 0.1, 0.1]}
          type="OBJ"
        />
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text: "Hello World!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
}

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center"
  }
});
