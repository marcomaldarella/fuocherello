import * as THREE from "three";
import type { MediaItem } from "./types";

const textureCache = new Map<string, THREE.Texture>();
const loadCallbacks = new Map<string, Set<(tex: THREE.Texture) => void>>();

const isTextureLoaded = (tex: THREE.Texture): boolean => {
  const img = tex.image as HTMLImageElement | undefined;
  return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
};

export const getTexture = (item: MediaItem, onLoad?: (texture: THREE.Texture) => void): THREE.Texture => {
  const key = item.url;
  const existing = textureCache.get(key);

  if (existing) {
    if (onLoad) {
      if (isTextureLoaded(existing)) {
        onLoad(existing);
      } else {
        loadCallbacks.get(key)?.add(onLoad);
      }
    }
    return existing;
  }

  const callbacks = new Set<(tex: THREE.Texture) => void>();
  if (onLoad) callbacks.add(onLoad);
  loadCallbacks.set(key, callbacks);

  // Create texture manually using HTMLImageElement for better cross-origin support
  const img = new Image();
  img.crossOrigin = "anonymous";
  const texture = new THREE.Texture(img);

  img.onload = () => {
    texture.image = img;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    loadCallbacks.get(key)?.forEach((cb) => {
      try {
        cb(texture);
      } catch (err) {
        console.error(`Callback failed: ${JSON.stringify(err)}`);
      }
    });
    loadCallbacks.delete(key);
  };

  img.onerror = (err) => {
    console.error("Texture image load failed:", key, err);
    loadCallbacks.delete(key);
  };

  img.src = key;

  textureCache.set(key, texture);
  return texture;
};

export const clearTextureCache = () => {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
  loadCallbacks.clear();
};
