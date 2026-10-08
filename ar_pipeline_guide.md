# PoreDekho VTO: AR Optimization & Pipeline Guide

## Context: Bangladesh Market
For the BD market, most users are on low-to-mid tier Android devices over variable 3G/4G networks. To minimize bounce rates on our Web-AR platform and Meta Spark filters, 3D assets must be ruthlessly optimized. Target size for Web-AR: **< 2MB**. Target for Meta Spark: **< 4MB**.

---

## 1. Web-AR: Compressing .glb / .gltf Models
We use Google's `<model-viewer>` for Web-AR on the web application. To ensure fast loading, follow these steps:

### A. Geometry Optimization
*   **Decimation:** Use Blender's Decimate modifier to reduce polygon count. Aim for under 10k-20k triangles for shoes/glasses/jewelry.
*   **Baking:** Bake high-poly details (like stitching or skin pores) into Normal maps. Do not rely on geometry for micro-details.

### B. Texture Compression (KTX2 / Basis Universal)
Standard JPEGs/PNGs in GLBs consume high VRAM, which frequently crashes mobile browsers on low-end phones. We must use KTX2.
*   Use `gltf-transform` CLI:
    ```bash
    gltf-transform ktx input.glb output_ktx2.glb --tc ETC1S
    ```
*   `ETC1S` is highly recommended for base color/normals on mobile. Use `UASTC` only if visual artifacts are too prominent (e.g., metallic/roughness maps or detailed text).

### C. Mesh Compression (Draco vs. Meshopt)
*   **Meshopt** is preferred over Draco for Web-AR. The decoder is lighter, uses less memory, and is faster to initialize on constrained devices.
*   Use `gltf-transform`:
    ```bash
    gltf-transform optimize input.glb output_optimized.glb --compress meshopt
    ```

### D. Final Web-AR Asset Pipeline Command
You can combine all optimizations in one step using `gltf-transform`:
```bash
gltf-transform optimize raw_model.glb poredekho_model.glb --texture-compress ktx2 --compress meshopt
```

---

## 2. Meta Spark Filters (Facebook / Instagram)
PoreDekho's social commerce strategy relies heavily on Meta Spark filters. 

### A. Setup & Tracker Types
*   **Face Tracking (Makeup/Glasses/Jewelry):** Keep the Face Mesh geometry clean. Use the default face tracker provided by Spark but optimize all custom materials applied to it.
*   **Target Tracking (Product Packaging):** Ensure the tracking image has high contrast and isn't repetitive, which allows the mobile tracker to quickly latch on without burning battery.

### B. Material & Texture Optimization in Spark
*   **Resize Textures:** Meta Spark Studio compresses textures automatically, but you should never import 4K textures. Pre-scale to 1024x1024 (or ideally 512x512) maximum.
*   **Compression Settings:** In Spark Studio, select your texture, and under the Inspector panel, check **Manual Compression**. 
    *   Use **PVRTC** for iOS.
    *   Use **ETC2** for Android to maximize compatibility.
*   **Disable Unused Maps:** If an item isn't highly reflective, remove the Environment/Metallic/Roughness maps and rely purely on the Base Color to save space.

### C. Block Instancing
*   If using multiple similar objects (e.g., multiple color variants of a lipstick, glasses frames, or eyelashes), use **Blocks** in Spark Studio to instance the objects rather than duplicating geometry, saving precious megabytes.

### D. Testing & Publishing
*   **Test on Realistic Devices:** Always use the Meta Spark Player app on a low-end Android (e.g., a standard Xiaomi, Symphony, or Walton device) to check for FPS drops and thermal throttling before submitting.
*   **File Size Limits:** Ensure the final export `.arexport` is strictly under 4MB to guarantee rapid downloads on cellular data. Meta allows up to 4MB for IG and FB, but aiming for 2MB yields significantly higher user engagement.
