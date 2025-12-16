# Expo Three.js Demo

**English | [中文](./README-zh.md)**

A 3D demo project built with Expo and React Three Fiber, showcasing the integration capabilities of Three.js in React Native applications.

## 📱 Project Screenshot

![Project Screenshot](/.github/resources/simple-mesh%20.jpg)

## ✨ Features

- 🎲 **3D Cube Rendering** - Interactive 3D cubes rendered with React Three Fiber
- 🔄 **Auto-Rotation Animation** - Continuous cube rotation demonstrating smooth 3D animations
- 🎯 **Interactive Experience** - Support for click and hover interactions:
  - Click cubes to scale them up/down
  - Change color on mouse hover
- 💡 **Lighting Effects** - Ambient and point lights for realistic 3D visuals

## 🛠️ Tech Stack

- **Expo** - React Native development framework
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe JavaScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun (modern JavaScript runtime and package manager)
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Install Dependencies

```bash
bun install
```

### Run the Project

```bash
# Start development server
bun start

# Run on Android device
bun run android

# Run on iOS device
bun run ios

# Run in browser
bun run web
```

## 📁 Project Structure

```
expo-threejs-demo/
├── app/
│   ├── index.tsx           # Main app component with 3D scene
│   └── _layout.tsx         # App layout configuration
├── .github/
│   └── resources/          # Project resources
├── package.json            # Project dependencies configuration
└── README.md              # Project documentation
```

## 🎮 Usage Guide

1. Launch the app to see two orange 3D cubes
2. The cubes rotate automatically
3. **Click on a cube** - Scale it up by 1.5x
4. **Mouse hover** - Change cube color to pink

## 🧩 Core Components

### Box Component

The main 3D cube component with the following features:

- **Auto-rotation** - Uses `useFrame` hook for per-frame rotation
- **Interaction States** - Manages `hovered` and `active` states
- **Event Handling** - Responds to clicks, hovers, and other user interactions

```typescript
// Core functionality snippet
useFrame(() => {
  if (mesh.current) {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  }
});
```

## 🔧 Customization

You can customize the 3D scene by modifying the following parameters:

- **Rotation Speed** - Adjust rotation increments in `useFrame`
- **Cube Size** - Modify `boxGeometry` parameters
- **Color Scheme** - Change `meshStandardMaterial` color values
- **Lighting Position** - Adjust `pointLight` position coordinates

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project!

## 📄 License

MIT License

## 🔗 Related Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Documentation](https://threejs.org/docs/)