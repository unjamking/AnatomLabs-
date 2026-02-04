/**
 * HumanKitView - React Native wrapper for BioDigital HumanKit SDK
 *
 * This component provides a 3D interactive human anatomy viewer powered by
 * BioDigital's professional anatomical models.
 */

import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  Platform,
  NativeModules,
  ViewStyle,
  Text,
} from 'react-native';

// BioDigital HumanKit API Credentials
// Get these from https://developer.biodigital.com
const HUMANKIT_DEVELOPER_KEY = 'c492970bf9878918251219873ae803f8c1e2191e';
const HUMANKIT_SECRET_KEY = '86c5a3d5cae8869398128c81ab7fcc5ecba193f6';

// Types
export interface AnatomyModel {
  id: string;
  name: string;
  category: string;
}

export interface ObjectPickedEvent {
  objectId: string;
  objectName: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface HumanKitViewProps {
  style?: ViewStyle;
  initialModelId?: string;
  onModelLoaded?: (modelId: string) => void;
  onModelLoadError?: (error: string) => void;
  onObjectPicked?: (event: ObjectPickedEvent) => void;
  onSDKValidated?: () => void;
  onSDKError?: (error: string) => void;
}

export interface HumanKitViewRef {
  loadModel: (modelId: string) => void;
  resetCamera: () => void;
  toggleXray: (enabled: boolean) => void;
  dissect: (objectId: string) => void;
  reset: () => void;
}

// Native component interface
interface NativeHumanKitViewProps {
  style?: ViewStyle;
  developerKey: string;
  secretKey: string;
  initialModelId?: string;
  onModelLoaded?: (event: { nativeEvent: { modelId: string } }) => void;
  onModelLoadError?: (event: { nativeEvent: { error: string } }) => void;
  onObjectPicked?: (event: { nativeEvent: ObjectPickedEvent }) => void;
  onSDKValidated?: (event: { nativeEvent: Record<string, never> }) => void;
  onSDKError?: (event: { nativeEvent: { error: string } }) => void;
}

// Try to load the native component
let NativeHumanKitView: React.ComponentType<NativeHumanKitViewProps> | null = null;
try {
  if (Platform.OS === 'ios') {
    NativeHumanKitView = requireNativeComponent<NativeHumanKitViewProps>('HumanKitView');
  }
} catch (e) {
  console.log('HumanKitView native component not available:', e);
  NativeHumanKitView = null;
}

// Native module for imperative methods
const HumanKitModule = Platform.OS === 'ios' ? NativeModules.HumanKitModule : null;

// Get available anatomy models
export async function getAvailableModels(): Promise<AnatomyModel[]> {
  if (Platform.OS !== 'ios' || !HumanKitModule) {
    console.warn('HumanKit is only available on iOS');
    return [];
  }
  return HumanKitModule.getAvailableModels();
}

// Predefined model categories for easy access
// These are BioDigital content IDs - format may vary
// Check https://human.biodigital.com for available models
export const AnatomyModels = {
  // Full Body - using BioDigital's standard content IDs
  MALE_FULL_BODY: 'be/2RBM',  // Male anatomy
  FEMALE_FULL_BODY: 'be/1Sop', // Female anatomy

  // Muscular System
  MUSCULAR_MALE: 'be/1HVi',   // Muscular system
  MUSCULAR_FEMALE: 'be/1HVi', // Muscular system
  DEEP_MUSCLES: 'be/1HVi',    // Muscular system

  // Skeletal System
  SKELETAL: 'be/16Mb',        // Skeletal system
  AXIAL_SKELETON: 'be/16Mb',  // Skeletal system
  APPENDICULAR_SKELETON: 'be/16Mb', // Skeletal system

  // Organs
  BRAIN: 'be/2ccD',           // Brain
  HEART: 'be/2BZV',           // Heart anatomy
  DIGESTIVE: 'be/1NWT',       // Digestive system
  RESPIRATORY: 'be/2eJa',     // Respiratory system
  CIRCULATORY: 'be/2dAj',     // Circulatory system
  NERVOUS: 'be/2dqN',         // Nervous system

  // Regional
  HEAD_NECK: 'be/2ccD',       // Head region
  TORSO: 'be/2RBM',           // Torso
  ARM: 'be/2RBM',             // Arm
  LEG: 'be/2RBM',             // Leg

  // Tissue
  SKIN: 'be/2RBM',            // Skin
  CELL: 'be/2RBM',            // Cell
};

/**
 * HumanKitView Component
 *
 * Displays an interactive 3D human anatomy model using BioDigital's HumanKit SDK.
 * Only available on iOS. Falls back to a placeholder on other platforms.
 */
const HumanKitView = forwardRef<HumanKitViewRef, HumanKitViewProps>(
  (
    {
      style,
      initialModelId,
      onModelLoaded,
      onModelLoadError,
      onObjectPicked,
      onSDKValidated,
      onSDKError,
    },
    ref
  ) => {
    const nativeRef = useRef<any>(null);

    // Expose imperative methods via ref
    useImperativeHandle(ref, () => ({
      loadModel: (modelId: string) => {
        if (Platform.OS === 'ios' && nativeRef.current) {
          const handle = findNodeHandle(nativeRef.current);
          if (handle) {
            UIManager.dispatchViewManagerCommand(handle, 'loadModel', [modelId]);
          }
        }
      },
      resetCamera: () => {
        if (Platform.OS === 'ios' && nativeRef.current) {
          const handle = findNodeHandle(nativeRef.current);
          if (handle) {
            UIManager.dispatchViewManagerCommand(handle, 'resetCamera', []);
          }
        }
      },
      toggleXray: (enabled: boolean) => {
        if (Platform.OS === 'ios' && nativeRef.current) {
          const handle = findNodeHandle(nativeRef.current);
          if (handle) {
            UIManager.dispatchViewManagerCommand(handle, 'toggleXray', [enabled]);
          }
        }
      },
      dissect: (objectId: string) => {
        if (Platform.OS === 'ios' && nativeRef.current) {
          const handle = findNodeHandle(nativeRef.current);
          if (handle) {
            UIManager.dispatchViewManagerCommand(handle, 'dissect', [objectId]);
          }
        }
      },
      reset: () => {
        if (Platform.OS === 'ios' && nativeRef.current) {
          const handle = findNodeHandle(nativeRef.current);
          if (handle) {
            UIManager.dispatchViewManagerCommand(handle, 'reset', []);
          }
        }
      },
    }));

    // Event handlers
    const handleModelLoaded = useCallback(
      (event: { nativeEvent: { modelId: string } }) => {
        onModelLoaded?.(event.nativeEvent.modelId);
      },
      [onModelLoaded]
    );

    const handleModelLoadError = useCallback(
      (event: { nativeEvent: { error: string } }) => {
        onModelLoadError?.(event.nativeEvent.error);
      },
      [onModelLoadError]
    );

    const handleObjectPicked = useCallback(
      (event: { nativeEvent: ObjectPickedEvent }) => {
        onObjectPicked?.(event.nativeEvent);
      },
      [onObjectPicked]
    );

    const handleSDKValidated = useCallback(() => {
      onSDKValidated?.();
    }, [onSDKValidated]);

    const handleSDKError = useCallback(
      (event: { nativeEvent: { error: string } }) => {
        onSDKError?.(event.nativeEvent.error);
      },
      [onSDKError]
    );

    // Fallback for non-iOS platforms or when native module not set up
    if (Platform.OS !== 'ios') {
      return (
        <View style={[styles.container, styles.fallback, style]}>
          <Text style={styles.fallbackTitle}>3D Anatomy Viewer</Text>
          <Text style={styles.fallbackText}>
            BioDigital HumanKit is only available on iOS devices.
          </Text>
          <Text style={styles.fallbackSubtext}>
            Please run this app on an iOS device or simulator.
          </Text>
        </View>
      );
    }

    if (!NativeHumanKitView) {
      return (
        <View style={[styles.container, styles.fallback, style]}>
          <Text style={styles.fallbackTitle}>3D Anatomy Viewer</Text>
          <Text style={styles.fallbackText}>Native module not configured.</Text>
          <Text style={styles.fallbackSubtext}>
            Please rebuild the app with native code:{'\n\n'}
            npx expo run:ios
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <NativeHumanKitView
          ref={nativeRef}
          style={StyleSheet.absoluteFill}
          developerKey={HUMANKIT_DEVELOPER_KEY}
          secretKey={HUMANKIT_SECRET_KEY}
          initialModelId={initialModelId}
          onModelLoaded={handleModelLoaded}
          onModelLoadError={handleModelLoadError}
          onObjectPicked={handleObjectPicked}
          onSDKValidated={handleSDKValidated}
          onSDKError={handleSDKError}
        />
      </View>
    );
  }
);

HumanKitView.displayName = 'HumanKitView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  fallbackText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HumanKitView;
