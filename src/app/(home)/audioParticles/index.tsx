import "@expo/metro-runtime";

import { Canvas } from "@react-three/fiber/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ParticleEffectNative } from "../../../components/ParticleEffectNative";
import { useAudioAmplitude } from "../../../hooks/useAudioAmplitude";

export default function App() {
  const { amplitude, isRecording, toggleRecording } = useAudioAmplitude({
    interval: 50, // 50ms polling for smooth animation
  });

  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <ParticleEffectNative amplitude={amplitude} />
      </Canvas>

      {/* Recording toggle button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isRecording ? styles.buttonRecording : styles.buttonIdle,
          ]}
          onPress={toggleRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "🔴 Stop" : "🎤 Start"}
          </Text>
        </TouchableOpacity>

        {/* Amplitude indicator */}
        <View style={styles.amplitudeContainer}>
          <View
            style={[styles.amplitudeBar, { width: `${amplitude * 100}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
  },
  buttonIdle: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonRecording: {
    backgroundColor: "rgba(255, 50, 50, 0.4)",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  amplitudeContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  amplitudeBar: {
    height: "100%",
    backgroundColor: "#4ade80",
    borderRadius: 4,
  },
});
