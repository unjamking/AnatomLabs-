# 3D Anatomy Integration Guide

## Current Implementation

The app now uses an **advanced 3D anatomical body model** built with React Three Fiber and Three.js primitives.

### Features

1. **Detailed Anatomical Structure**
   - Head, neck, torso (upper/lower), pelvis
   - Arms: shoulders, upper arms, elbows, forearms, hands
   - Legs: hips, thighs, knees, calves, feet
   - Realistic proportions and joint locations

2. **Interactive Muscle Markers**
   - Red spheres positioned at muscle locations
   - Hover effects with scaling animation
   - Tap to view detailed muscle information
   - Emissive materials for visibility

3. **Professional Lighting & Shadows**
   - Ambient, directional, point, and spot lights
   - Real-time shadow casting
   - Contact shadows on ground plane
   - Environment mapping (city preset)

4. **Advanced Controls**
   - Orbit controls (rotate, zoom, pan)
   - Toggle body visibility
   - Multi-touch gestures
   - Smooth camera movement

5. **Visual Polish**
   - Skin-tone materials with transparency
   - Metalness and roughness for realism
   - Subtle breathing animation
   - Professional UI overlays

## Upgrading to Real 3D Models

### Option 1: Open3DModel (Recommended)

**Open3DModel** is an open-source project from European universities providing free GLB anatomy models.

**Benefits:**
- Free and open source (CC BY-SA license)
- Medical-grade accuracy
- Downloadable GLB files
- Can be hosted locally

**Implementation Steps:**

1. **Download Models**
   ```bash
   # Visit: https://anatomytool.org/open3dmodel
   # Download desired anatomy GLB files
   # Place in: assets/models/anatomy/
   ```

2. **Load GLB Models**
   ```typescript
   import { useGLTF } from '@react-three/drei/native';

   function AnatomyModel() {
     const { scene } = useGLTF(require('../../assets/models/anatomy/body.glb'));
     return <primitive object={scene} />;
   }
   ```

3. **Configure Metro**
   ```javascript
   // metro.config.js
   module.exports = {
     resolver: {
       assetExts: ['glb', 'gltf', 'png', 'jpg'],
     },
   };
   ```

4. **Preload Assets**
   ```typescript
   import { Asset } from 'expo-asset';

   await Asset.loadAsync([
     require('./assets/models/anatomy/body.glb'),
   ]);
   ```

**Resources:**
- [Open3DModel](https://anatomytool.org/open3dmodel)
- [Open Anatomy Project](https://www.openanatomy.org/)

### Option 2: BioDigital Human API

**BioDigital** offers professional 3D anatomy via API (requires API key and subscription).

**Benefits:**
- Professional medical-grade models
- Extensive anatomy library
- Real-time streaming
- Regular updates

**Limitations:**
- Requires API key (paid)
- iOS SDK is native Swift (not React Native compatible)
- Best for web via iframe embedding

**Implementation for Web:**
```typescript
// For web version only
<iframe
  src="https://human.biodigital.com/widget/?be=MODEL_ID&dk=YOUR_API_KEY"
  width="100%"
  height="600"
/>
```

**For React Native:**
- Use WebView component to embed BioDigital iframe
- Limited interaction compared to native 3D
- Requires internet connection

**Resources:**
- [BioDigital Developer Portal](https://developer.biodigital.com/)
- [BioDigital Human API](https://www.biodigital.com/product/developer-toolkits)

### Option 3: Custom GLB Models

You can use any GLB/GLTF anatomy model from various sources:

**Free Resources:**
- [Sketchfab - Human Anatomy](https://sketchfab.com/3d-models/categories/science-nature)
- [Poly.cam GLB Models](https://poly.cam/3d-models/gltf-models)
- [TurboSquid Free Models](https://www.turbosquid.com/Search/3D-Models/free/glb-model)

**Conversion Tools:**
- [gltf.pmnd.rs](https://gltf.pmnd.rs/) - Convert GLTF to React components
- [gltfjsx](https://github.com/pmndrs/gltfjsx) - CLI tool for GLB → JSX

**Example Usage:**
```bash
# Install gltfjsx
npm install -g gltfjsx

# Convert GLB to React component
gltfjsx model.glb --transform

# Output: Model.tsx component ready to use
```

## Technical Implementation Details

### React Three Fiber in React Native

**Important:** Always import from `/native` variants:
```typescript
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls, useGLTF } from '@react-three/drei/native';
```

### Performance Optimization

1. **Use Suspense for Loading**
   ```typescript
   <Suspense fallback={<LoadingSpinner />}>
     <Model />
   </Suspense>
   ```

2. **Optimize Geometry**
   - Reduce polygon count for mobile
   - Use LOD (Level of Detail) for complex models
   - Compress textures

3. **Efficient Rendering**
   ```typescript
   <Canvas
     gl={{ antialias: true, powerPreference: 'high-performance' }}
     frameloop="demand" // Only render when needed
   >
   ```

4. **Dispose Resources**
   ```typescript
   useEffect(() => {
     return () => {
       geometry.dispose();
       material.dispose();
     };
   }, []);
   ```

### Muscle Interaction System

The current implementation uses a marker-based system:

1. **Muscle Data Structure**
   ```typescript
   interface Muscle {
     id: string;
     name: string;
     position_x: number;
     position_y: number;
     position_z: number;
     layer: number;
   }
   ```

2. **Interactive Markers**
   - Positioned at muscle attachment points
   - Click detection via Three.js raycasting
   - Visual feedback with hover states

3. **Future Enhancement: Mesh-Based Selection**
   ```typescript
   // Load model with named muscle meshes
   const { scene } = useGLTF('body.glb');

   // Find and make interactive
   scene.traverse((child) => {
     if (child.name.includes('muscle_')) {
       child.userData.selectable = true;
       child.onClick = () => handleMuscleClick(child.name);
     }
   });
   ```

## Recommended Approach

For the best balance of quality, cost, and ease of implementation:

### Phase 1: Current (Complete ✓)
- Geometric primitive-based body
- Interactive muscle markers
- Professional lighting and materials

### Phase 2: Open3DModel Integration (Recommended Next)
1. Download free GLB models from Open3DModel
2. Replace geometric body with loaded GLB
3. Keep marker system for muscle selection
4. Add layer switching (skin, muscles, skeleton)

### Phase 3: Advanced Features
1. Animations (walk cycle, exercise demonstrations)
2. Real-time muscle highlighting during workouts
3. Injury zones visualization
4. AR mode (using expo-ar)

## Code Examples

### Loading a GLB Model

```typescript
import { useGLTF } from '@react-three/drei/native';

function AnatomyModel({ modelPath }: { modelPath: string }) {
  const { scene, nodes, materials } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

// Preload for better performance
useGLTF.preload(require('./assets/models/body.glb'));
```

### Interactive Mesh Selection

```typescript
function SelectableMuscle({ mesh }: { mesh: THREE.Mesh }) {
  const [selected, setSelected] = useState(false);

  return (
    <mesh
      geometry={mesh.geometry}
      material={mesh.material}
      onClick={() => setSelected(!selected)}
    >
      <meshStandardMaterial
        {...mesh.material}
        emissive={selected ? '#ff0000' : '#000000'}
        emissiveIntensity={selected ? 0.5 : 0}
      />
    </mesh>
  );
}
```

### Layer Switching

```typescript
function LayeredAnatomy({ layer }: { layer: number }) {
  const { scene } = useGLTF('full-anatomy.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child.userData.layer !== undefined) {
        child.visible = child.userData.layer <= layer;
      }
    });
  }, [layer, scene]);

  return <primitive object={scene} />;
}
```

## Dependencies

Current packages installed:
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `three@0.163.0` - 3D library
- `expo-gl` - WebGL integration for React Native
- `expo-asset` - Asset loading and caching
- `react-native-gesture-handler` - Touch gestures

Additional for advanced features:
```bash
npm install @react-three/xr  # For AR/VR
npm install expo-ar          # For augmented reality
npm install leva            # For debug GUI
```

## Performance Notes

- Physical devices perform better than simulators for 3D
- Reduce model complexity for older devices
- Use texture compression (KTX2, Basis)
- Implement LOD for complex scenes
- Monitor frame rate with `<Stats />` from drei

## Troubleshooting

### "Module not found: drei/native"
```bash
npm install @react-three/drei
```

### "Cannot read property 'scene' of undefined"
Ensure model is loaded with Suspense:
```typescript
<Suspense fallback={null}>
  <Model />
</Suspense>
```

### "Metro bundler not recognizing .glb files"
Update metro.config.js:
```javascript
module.exports = {
  resolver: {
    assetExts: ['db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'glb', 'gltf'],
  },
};
```

## Sources

Based on research from:
- [React Three Fiber Documentation](https://r3f.docs.pmnd.rs/)
- [Open3DModel Project](https://anatomytool.org/open3dmodel)
- [BioDigital Human API](https://developer.biodigital.com/)
- [Loading Models in R3F](https://r3f.docs.pmnd.rs/tutorials/loading-models)
- [React Native 3D Visualizations](https://dev.to/thechaudhrysab/react-native-and-threejs-25p4)
- [Open Anatomy Project](https://www.openanatomy.org/)
- [Sketchfab Anatomy Models](https://sketchfab.com/3d-models/categories/science-nature)

## Next Steps

1. ✅ Basic geometric body (COMPLETE)
2. ⏭️ Download Open3DModel GLB files
3. ⏭️ Integrate GLB models with useGLTF
4. ⏭️ Add layer switching UI
5. ⏭️ Implement mesh-based muscle selection
6. ⏭️ Add exercise animations
7. ⏭️ Explore AR features

---

**Current Status:** Phase 1 complete with advanced geometric body model. Ready for GLB model integration.
