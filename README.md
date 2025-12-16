# Expo Three.js Demo

**English | [中文](README-zh.md)**

A React Native application showcasing Three.js integration with interactive 3D graphics and audio-reactive particle effects.

## ✨ Features

- **🎵 Audio-Reactive Particles**: Real-time particle system that responds to microphone input
- **🎨 Custom Shaders**: Advanced vertex and fragment shaders for organic animations
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **⚡ High Performance**: Optimized for mobile devices using Expo Three
- **🎯 Interactive Examples**: Multiple 3D demonstrations with different effects

## 🛠️ Technologies Used

- **[Expo](https://expo.dev/)** - Cross-platform mobile development framework
- **[React Native](https://reactnative.dev/)** - Native mobile app development
- **[React Three Fiber](https://github.com/pmndrs/react-three-fiber)** - React renderer for Three.js
- **[Expo Three](https://github.com/expo/expo-three)** - Three.js support for Expo
- **[Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)** - Real-time audio processing
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

## 🚀 Getting Started

### Prerequisites

- Bun (recommended for faster performance) or Node.js
- Expo CLI
- Physical device or simulator for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/expo-threejs-demo.git
cd expo-threejs-demo

# Install dependencies
bun install
```

### Running the App

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

## 📖 Examples

### 🏠 Home Screen
The main interface that showcases all available 3D demonstrations through an elegant card-based navigation system.

![Home Screen](.github/resources/home.jpg){:width="200"}

### 🎵 Audio Particles
A mesmerizing particle system that reacts to ambient sound or microphone input in real-time.

**Features:**
- Real-time audio capture and processing
- Custom shader-based particle animations
- Organic deformation using Simplex noise
- Dynamic color transitions based on audio amplitude

**How to use:**
1. Navigate to the Audio Particles example
2. Tap "🎤 Start" to begin audio recording
3. Make sounds or play music to see the particles react
4. Watch as particles dance and deform based on sound amplitude
5. Tap "🔴 Stop" to end recording

![Audio Particles Demo](.github/resources/audioParticles.jpg){:width="200"}

### 🎲 Simple Mesh
A foundational example demonstrating basic 3D mesh rendering with lighting and material effects.

**Features:**
- Interactive 3D geometry with rotation animations
- Dynamic lighting with ambient and point lights
- Touch/gesture interactions for scaling and color changes
- Optimized performance for mobile devices

**How to use:**
1. Navigate to the Simple Mesh example
2. Tap on the mesh to scale it up
3. Observe the auto-rotation animation
4. Experience smooth 3D rendering performance

![Simple Mesh Demo](.github/resources/simple-mesh .jpg){:width="200"}

---

*More examples coming soon! Each example demonstrates different aspects of Three.js integration with React Native.*

## 🏗️ Project Structure

```
src/
├── app/                    # Expo Router file-based routing
│   ├── (home)/            # Home tab navigation group
│   │   ├── index.tsx      # Home screen with example cards
│   │   ├── audioParticles/ # Audio-reactive particle demo
│   │   └── sampleMesh/    # Basic mesh rendering demo
│   └── _layout.tsx        # Root navigation layout
├── components/            # Reusable components
│   ├── ParticleEffectNative.tsx # Audio-reactive 3D particle system
│   └── ExampleCard.tsx    # Home screen card component
└── hooks/                 # Custom React hooks
    └── useAudioAmplitude.ts # Audio recording and amplitude extraction
```

## 🎨 Audio System Features

- **Real-time Processing**: Captures microphone input with configurable polling intervals
- **Amplitude Normalization**: Converts audio levels (-60dB to 0dB) to 0-1 range for smooth animations
- **Permission Handling**: Automatic microphone permission requests with user-friendly prompts
- **Cross-platform Support**: Works consistently across iOS and Android devices

## 🧠 Technical Highlights

### Shader Programming
- Custom vertex shaders with Simplex noise for organic deformation
- Fragment shaders with HSV color space transformations
- Optimized for mobile GPU performance

### Audio Integration
- Expo Audio API with metering enabled
- Real-time amplitude extraction and normalization
- Smooth animation updates at 50ms intervals

### 3D Graphics
- React Three Fiber for declarative 3D scenes
- Fibonacci sphere distribution for even particle spacing
- High-performance mesh rendering with 162x162 sphere geometry

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for the amazing React renderer for Three.js
- [Expo](https://expo.dev/) for the excellent development platform
- The [Three.js](https://threejs.org/) community for inspiration and examples

## 📞 Support

If you have any questions or run into issues, please:
- Check the [Issues](https://github.com/your-username/expo-threejs-demo/issues) page
- Create a new issue with detailed information
- Join our [Discord](https://discord.gg/expo) community for real-time support