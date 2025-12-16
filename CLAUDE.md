# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application demonstrating Three.js integration with interactive 3D graphics. The app features audio-reactive particle effects and basic mesh rendering examples using React Three Fiber.

## Key Technologies

- **Expo SDK 54** with React Native 0.81
- **React Three Fiber** (@react-three/fiber) for Three.js integration
- **Expo Three** for 3D graphics native support
- **Expo Audio** for real-time audio processing
- **Expo Router** for file-based navigation
- **TypeScript** for type safety

## Development Commands

```bash
# Start development server
bun start
# or
bunx expo

# Platform-specific builds
bun run android    # Android development
bun run ios        # iOS development
bun run web        # Web development

# Code quality
bun run lint       # Run ESLint
```

## Architecture

### File Structure

- `src/app/` - Expo Router file-based routing
  - `(home)/` - Home tab navigation group
    - `index.tsx` - Home screen with example cards
    - `audioParticles/` - Audio-reactive particle demo
    - `sampleMesh/` - Basic mesh rendering demo
  - `_layout.tsx` - Root navigation layout
- `src/components/` - Reusable components
  - `ParticleEffectNative.tsx` - Audio-reactive 3D particle system
  - `ExampleCard.tsx` - Home screen card component
- `src/hooks/` - Custom React hooks
  - `useAudioAmplitude.ts` - Audio recording and amplitude extraction

### Navigation Structure

Uses Expo Router with nested stack navigation:
- Root layout wraps entire app
- Home tab group contains example screens
- Individual example screens are accessible via navigation

### 3D Graphics Integration

The app uses React Three Fiber for 3D rendering:
- **ParticleEffectNative**: Custom shader-based particle system with audio reactivity
- **Audio Processing**: Real-time microphone input with amplitude-based animations
- **Shaders**: Custom vertex and fragment shaders for organic deformation effects

### Audio System

- Uses Expo Audio's recorder with metering enabled
- Normalizes audio levels from -60dB to 0dB range
- Real-time polling for smooth animation updates
- Permission handling for microphone access

## Development Notes

- The app uses file-based routing with Expo Router
- All 3D components are native-compatible using expo-three
- Audio permissions are requested on component mount
- Shader materials require uniforms for time-based animations
- Particles use Fibonacci sphere distribution for even spacing

## Build Configuration

- Uses Expo's managed workflow
- Babel preset includes Expo transforms
- ESLint uses Expo's flat configuration
- New Architecture and React Compiler are enabled in experiments