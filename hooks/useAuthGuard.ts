import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useAuthGuard() {
  const { isSignedIn, isOnboarded, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = (segments[0] as string) === 'onboarding';

    if (!isSignedIn && !inAuthGroup) {
      // Redirect to login if not signed in and not in auth group
      router.replace('/(auth)/login' as any);
    } else if (isSignedIn && !isOnboarded && !inOnboarding) {
      // Redirect to onboarding if signed in but not onboarded
      router.replace('/onboarding' as any);
    } else if (isSignedIn && isOnboarded && (inAuthGroup || inOnboarding)) {
      // Redirect to home if signed in, onboarded, and in auth or onboarding
      router.replace('/(tabs)' as any);
    }
  }, [isSignedIn, isOnboarded, segments, isLoading]);
}
