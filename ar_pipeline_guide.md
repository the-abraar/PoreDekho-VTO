# PoreDekho VTO: AR Optimization & Pipeline Guide

## Context: Bangladesh Market
For the BD market, most users are on low-to-mid tier Android devices over variable 3G/4G networks. To minimize bounce rates on our Web-AR platform, 3D assets must be ruthlessly optimized. Target size for Web-AR: **< 2MB**. (The old Meta Spark target of < 4MB is discontinued along with the platform.)

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

## 2. Social channels (FB / IG / Messenger)
There is no native AR surface on Facebook or Instagram for third-party effects any more. Distribute a hosted try-on link per SKU (`tryon.html?sku=...`, made by `admin.html`) that sellers paste into Messenger, IG DMs, comments and Live descriptions. See judge.md blocker 2.
