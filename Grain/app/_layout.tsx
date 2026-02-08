import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { initDatabase } from '@/services/database/db';
import { initPhotoStorage } from '@/services/storage/photoStorage';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // データベース初期化
    initDatabase().catch(console.error);
    // 写真ストレージ初期化
    initPhotoStorage().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="camera"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="entry/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
