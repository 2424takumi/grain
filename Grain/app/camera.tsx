import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePhoto } from '@/services/storage/photoStorage';
import { createEntry } from '@/services/database/queries';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            カメラへのアクセス許可が必要です
          </Text>
          <Pressable onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>許可する</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleClose = () => {
    router.back();
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);

      // ハプティックフィードバック
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo) {
        // 写真を保存
        const { originalPath, thumbnailPath, fileSize, width, height } = await savePhoto(photo.uri);

        // エントリー作成
        const today = format(new Date(), 'yyyy-MM-dd');
        await createEntry({
          id: uuidv4(),
          entryDate: today,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          originalPhotoPath: originalPath,
          thumbnailPhotoPath: thumbnailPath,
          photoFileSize: fileSize,
          photoWidth: width,
          photoHeight: height,
          isDeleted: false,
        });

        // キャッシュを更新
        queryClient.invalidateQueries({ queryKey: ['entries'] });

        // タイムライン画面に戻る
        router.back();
      }
    } catch (error: any) {
      console.error('写真撮影エラー:', error);
      Alert.alert('エラー', '写真の保存に失敗しました。');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* 閉じるボタン */}
        <View style={styles.topControls}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {/* ヒントテキスト */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>前日と同じ構図で撮ろう</Text>
        </View>

        {/* 下部コントロール */}
        <View style={styles.bottomControls}>
          <View style={{ width: 44 }} />

          {/* シャッターボタン */}
          <Pressable
            onPress={takePicture}
            style={styles.shutterButton}
          >
            <View style={styles.shutterInner} />
          </Pressable>

          {/* カメラ切り替え */}
          <Pressable onPress={toggleCameraFacing} style={styles.flipButton}>
            <Text style={styles.flipButtonText}>⟳</Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  flipButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});
