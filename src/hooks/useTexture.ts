import { useEffect, useState, useRef } from "react";
import { Asset } from "expo-asset";
import * as THREE from "three";
import { TextureLoader as ExpoTextureLoader } from "expo-three";

/**
 * Load a texture from local assets for use in React Three Fiber
 * Uses expo-three's TextureLoader for React Native compatibility
 * @param module - The require()d asset
 * @returns THREE.Texture or null while loading
 */
export function useTexture(module: number): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTexture() {
      try {
        console.log("[useTexture] Starting texture load...");

        // Load the asset using expo-asset
        const asset = await Asset.fromModule(module).downloadAsync();
        console.log("[useTexture] Asset downloaded:", asset.localUri || asset.uri);

        if (!mounted) return;

        // Get the local URI
        const uri = asset.localUri || asset.uri;
        console.log("[useTexture] Loading texture from URI:", uri);

        // Use expo-three's TextureLoader which works in React Native
        const loader = new ExpoTextureLoader();
        const tex = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            uri,
            (loadedTexture: THREE.Texture) => {
              console.log("[useTexture] Texture loaded successfully");
              resolve(loadedTexture);
            },
            undefined,
            (error: any) => {
              console.error("[useTexture] Loader error:", error);
              reject(error);
            }
          );
        });

        if (tex && mounted) {
          // Set texture properties
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;

          textureRef.current = tex;
          setTexture(tex);
        }
      } catch (error) {
        console.error("[useTexture] Failed to load texture:", error);
        if (mounted) {
          setTexture(null);
        }
      }
    }

    loadTexture();

    return () => {
      mounted = false;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [module]);

  return texture;
}
