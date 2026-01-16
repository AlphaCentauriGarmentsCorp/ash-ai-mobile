# Safe Area Context - Quick Reference

## Import Statements

### ✅ Correct
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

### ❌ Incorrect
```tsx
import { SafeAreaView } from 'react-native'; // Don't use this!
```

## Common Patterns

### 1. Full Screen with Safe Areas
```tsx
<SafeAreaView style={{ flex: 1 }}>
  <View>Your content</View>
</SafeAreaView>
```

### 2. Custom Padding with Insets
```tsx
const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }}>
  <Header />
</View>
```

### 3. Modal with Safe Areas
```tsx
const insets = useSafeAreaInsets();

<Modal visible={visible}>
  <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
    <ModalContent />
  </View>
</Modal>
```

### 4. Specific Edge Control
```tsx
<SafeAreaView edges={['top', 'left', 'right']}>
  {/* Bottom edge not protected */}
</SafeAreaView>
```

## Available Insets

```tsx
const insets = useSafeAreaInsets();

insets.top    // Status bar, notch, dynamic island
insets.bottom // Home indicator, navigation bar
insets.left   // Safe area on left (landscape)
insets.right  // Safe area on right (landscape)
```

## When to Use What

| Scenario | Use |
|----------|-----|
| Full screen component | `<SafeAreaView>` |
| Custom spacing needed | `useSafeAreaInsets()` |
| Modal/Overlay | `useSafeAreaInsets()` |
| Nested safe areas | `useSafeAreaInsets()` |
| Specific edges only | `<SafeAreaView edges={[...]}>` |

## Build Commands

After making changes:
```bash
# Expo development
npx expo prebuild
npx expo run:ios
npx expo run:android

# Or just start
npx expo start
```
