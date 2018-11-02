import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroParticleEmitter,
  ViroConstants
} from "react-viro";

export default class ParticleSnowSceneAR extends Component {
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
        <ViroParticleEmitter
          position={[0, 4.5, 0]}
          duration={2000}
          visible={true}
          delay={0}
          run={true}
          loop={true}
          fixedToEmitter={true}
          image={{
            source: require("./res/particle.png"),
            height: 0.01,
            width: 0.01,
            bloomThreshold: 1.0
          }}
          spawnBehavior={{
            particleLifetime: [5000, 5000],
            emissionRatePerSecond: [100, 100],
            spawnVolume: {
              shape: "box",
              params: [20, 1, 20],
              spawnOnSurface: false
            },
            maxParticles: 2000
          }}
          particleAppearance={{
            opacity: {
              initialRange: [0, 0],
              factor: "Time",
              interpolation: [
                { endValue: 1.0, interval: [0, 500] },
                { endValue: 0.0, interval: [4000, 5000] }
              ]
            },
            rotation: {
              initialRange: [0, 360],
              factor: "Time",
              interpolation: [{ endValue: 1080, interval: [0, 5000] }]
            },
            scale: {
              initialRange: [[5, 5, 5], [10, 10, 10]],
              factor: "Time",
              interpolation: [
                { endValue: [6, 6, 6], interval: [0, 1000] },
                { endValue: [10, 10, 10], interval: [3000, 5000] },
                { endValue: [5, 5, 5], interval: [4000, 5000] }
              ]
            }
          }}
          particlePhysics={{
            velocity: {
              initialRange: [[-2 * 1.0, -0.5, 0], [2 * 1.0, -3.0 * 1.0, 0]]
            }
          }}
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
