# Quick Package Update

## Issue
```
The following packages should be updated for best compatibility:
- expo-linking@8.0.10 → ~8.0.11
- expo-router@6.0.19 → ~6.0.21
- expo-splash-screen@31.0.12 → ~31.0.13
```

## Quick Fix

Run this command:

```bash
npm install
```

Then restart with cache clear:

```bash
npx expo start -c
```

## Done! ✅

Your packages will be updated to the correct versions.

## Alternative (if npm install doesn't work)

```bash
npx expo install --fix
```

This will automatically update all Expo packages to their compatible versions.
