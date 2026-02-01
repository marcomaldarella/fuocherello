import * as THREE from "three";
import type { MediaItem } from "./types";

const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const MAX_TEXTURE_CACHE = isMobile ? 24 : 64;
const textureCache = new Map<string, THREE.Texture>();
const loadCallbacks = new Map<string, Set<(tex: THREE.Texture) => void>>();
const loader = new THREE.TextureLoader();

const isTextureLoaded = (tex: THREE.Texture): boolean => {
  const img = tex.image as HTMLImageElement | undefined;
  return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
};

const evictTextures = () => {
  while (textureCache.size > MAX_TEXTURE_CACHE) {
    const firstKey = textureCache.keys().next().value as string | undefined;
    if (!firstKey) break;
    const tex = textureCache.get(firstKey);
    if (tex) tex.dispose();
    textureCache.delete(firstKey);
  }
};

export const getTexture = (item: MediaItem, onLoad?: (texture: THREE.Texture) => void): THREE.Texture => {
  const key = item.url;
  const existing = textureCache.get(key);

  if (existing) {
    // Move to end for LRU
    textureCache.delete(key);
    textureCache.set(key, existing);
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

  const texture = loader.load(
    key,
    (tex) => {
      tex.minFilter = isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = !isMobile;
      tex.anisotropy = isMobile ? 1 : 4;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;

      loadCallbacks.get(key)?.forEach((cb) => {
        try {
          cb(tex);
        } catch (err) {
          console.error(`Callback failed: ${JSON.stringify(err)}`);
        }
      });
      loadCallbacks.delete(key);
    },
    undefined,
    (err) => {
      console.error("Texture load failed:", key, err);
      loadCallbacks.delete(key);
    }
  );

  textureCache.set(key, texture);
  evictTextures();
  return texture;
};

export const clearTextureCache = () => {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
  loadCallbacks.clear();
};
