import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useCallback, useEffect, useRef } from "react";
import { Alert } from "react-native";

interface UseAudioAmplitudeOptions {
  // Polling interval in ms for recorder state (default: 50ms for smoother animation)
  interval?: number;
}

interface UseAudioAmplitudeReturn {
  // Normalized amplitude value between 0 and 1
  amplitude: number;
  // Whether recording is active
  isRecording: boolean;
  // Start recording
  startRecording: () => Promise<void>;
  // Stop recording
  stopRecording: () => Promise<void>;
  // Toggle recording state
  toggleRecording: () => Promise<void>;
}

/**
 * Normalizes dB value to 0-1 range
 * Metering typically returns values from -160 (silence) to 0 (max)
 */
function normalizeDb(db: number): number {
  // Clamp dB value between -60 and 0 for practical range
  // Most voice/music is between -60 and 0 dB
  const minDb = -60;
  const maxDb = 0;
  const clampedDb = Math.max(minDb, Math.min(maxDb, db));

  // Normalize to 0-1
  return (clampedDb - minDb) / (maxDb - minDb);
}

export function useAudioAmplitude(
  options: UseAudioAmplitudeOptions = {}
): UseAudioAmplitudeReturn {
  const { interval = 50 } = options;
  const hasPermission = useRef(false);

  // Create recorder with metering enabled
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  // Get real-time state updates
  const recorderState = useAudioRecorderState(recorder, interval);

  // Request permissions and set audio mode on mount
  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        hasPermission.current = status.granted;
        if (!status.granted) {
          Alert.alert(
            "Permission Required",
            "Microphone permission is required for audio-reactive effects."
          );
        }
        // Enable recording mode on iOS
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (error) {
        console.error("Failed to request audio permissions:", error);
      }
    })();
  }, []);

  const startRecording = useCallback(async () => {
    if (!hasPermission.current) {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      hasPermission.current = status.granted;
      if (!status.granted) {
        Alert.alert(
          "Permission Required",
          "Microphone permission is required for audio-reactive effects."
        );
        return;
      }
    }

    try {
      // Ensure recording mode is enabled on iOS
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    try {
      await recorder.stop();
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  }, [recorder]);

  const toggleRecording = useCallback(async () => {
    if (recorderState.isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [recorderState.isRecording, startRecording, stopRecording]);

  // Normalize metering value to 0-1 range
  const amplitude = recorderState.metering
    ? normalizeDb(recorderState.metering)
    : 0;

  return {
    amplitude,
    isRecording: recorderState.isRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
